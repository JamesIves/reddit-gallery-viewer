import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  map,
  Observable,
  of,
} from 'rxjs';
import { catchError, mergeMap, scan, switchMap } from 'rxjs/operators';
import {
  RedditFilter,
  IRedditQuery,
  IRedditRequestOptions,
  IRedditResult,
  RedditSubFilter,
  SafeMode,
  IRedditResultNatural,
  RedditRequestParameters,
  RedditPostHint,
} from 'src/app/models/reddit.model';

/**
 * Service which is used to communicate with the Reddit API.
 */
@Injectable({
  providedIn: 'root',
})
export class RedditService {
  private static readonly API_BASE = '/r';
  private static readonly MAX_CONTENT_FETCH = 24;
  private static readonly DEFAULT_SUBREDDIT = 'cats';
  private static readonly DEFAULT_PAGE = 't3_';

  private readonly _safeMode$ = new BehaviorSubject<SafeMode>(SafeMode.ENABLED);
  private readonly _subRedditName$ = new BehaviorSubject(
    RedditService.DEFAULT_SUBREDDIT
  );
  private readonly _subRedditPage$ = new BehaviorSubject(
    RedditService.DEFAULT_PAGE
  );
  private readonly _subRedditFilter$ = new BehaviorSubject(RedditFilter.HOT);
  private readonly _subRedditSubFilter$ = new BehaviorSubject<RedditSubFilter>(
    RedditSubFilter.ALL
  );

  /**
   * The query$ observable is the main mechanism of the app.
   * This observable will watch for changes to the other values such as page/name etc
   * and re-fetch data based on input changes. This observable can be subscribed to
   * within a component to generate a list of content using the async pipe.
   */
  private readonly _query$: Observable<IRedditQuery>;

  public constructor(private readonly http: HttpClient) {
    this._query$ = combineLatest([
      this.getSubRedditName(),
      this.getSubRedditFilter(),
      this.getSubRedditSubFilter(),
      this.getSafeMode(),
    ]).pipe(
      switchMap(([name, filter, subFilter, safeMode]) =>
        this.getSubRedditPage().pipe(
          mergeMap((page) =>
            this.getSubRedditContent({
              name,
              filter,
              page,
              subFilter,
              safeMode,
            }).pipe(
              catchError(() => {
                /**
                 * If the stream catches an error return an empty array.
                 * For the sake of this demo we'll just assume that the subreddit
                 * has no content if it doesn't exist.
                 */
                return of([]);
              })
            )
          ),

          /**
           * If the page observable emits instead of creating a new list it
           * will instead concat the previous results together with the new ones.
           * This is used for infinite scrolling pagination.
           */
          scan(
            (acc, curr) => ({
              results: curr.length ? acc.results.concat(curr) : acc.results,
              nextPage: curr[curr.length - 1]?.id,
            }),
            {
              results: [] as IRedditResult[],
              nextPage: undefined,
            } as IRedditQuery
          )
        )
      )
    );
  }

  /**
   * Sets the name of subreddit, for example 'cats' or 'fish'.
   * @param name The name of the subreddit.
   */
  public setSubRedditName(name: string): void {
    this._subRedditName$.next(name);
  }

  /**
   * Sets the name of the subreddit filter, for example 'hot' or 'new'.
   * @param filter The name of the filter {@see RedditFilter} for options.
   */
  public setSubRedditFilter(filter: RedditFilter): void {
    this._subRedditFilter$.next(filter);

    /** On each filter change reset the page back to default value
     * to prevent lingering pages. */
    this.setSubRedditPage(RedditService.DEFAULT_PAGE);
  }

  /**
   * Sets the name of the page to display. The Reddit API allows you to specify
   * at which point you want to fetch after. As a result we index the page name
   * after each fetch and use it to fetch the next set of paginated content.
   * @param page The name of the page to fetch content after.
   */
  public setSubRedditPage(page: string): void {
    this._subRedditPage$.next(`${RedditService.DEFAULT_PAGE}${page}`);
  }

  /**
   * Sets the name of the sub filter to display. Sub filters apply to specific
   * primary filter options, such as 'Top' so you can view top content of all time,
   * and days/months/year etc.
   * @param filter The name of the sub filter to display, {@see RedditSubFilter} for options.
   */
  public setSubRedditSubFilter(filter: RedditSubFilter): void {
    this._subRedditSubFilter$.next(filter);
    this.setSubRedditPage(RedditService.DEFAULT_PAGE);
  }

  /**
   * Sets the safe mode toggle on|off. Certain content from the Reddit
   * API is marked as inappropriate for minors, this flag is used to ensure
   * content is obfuscated before a user requests to see it.
   * @param enabled The safe mode flag, {@see SafeMode} for options.
   */
  public setSafeMode(enabled: SafeMode): void {
    this._safeMode$.next(enabled);
  }

  /**
   * Gets the sub reddit filter option as an observable.
   * @returns An observable that can translate the currently set filter option.
   */
  public getSubRedditFilter(): Observable<RedditFilter> {
    return this._subRedditFilter$.asObservable();
  }

  /**
   * Gets the sub reddit sub filter option as an observable.
   * @returns An observable that can translate the currently set sub filter option.
   */
  public getSubRedditSubFilter(): Observable<RedditSubFilter> {
    return this._subRedditSubFilter$.asObservable();
  }

  /**
   * Gets the sub reddit name option as an observable.
   * @returns An observable that contains the currently set name.
   */
  public getSubRedditName(): Observable<string> {
    return this._subRedditName$.asObservable();
  }

  /**
   * Gets the current page being viewed as an observable.
   * @returns An observable that can contains the currently set page.
   */
  public getSubRedditPage(): Observable<string> {
    return this._subRedditPage$.asObservable();
  }

  /**
   * Gets the currently set safe mode option as an observable.
   * @returns An observable that can translate the safe mode option.
   */
  public getSafeMode() {
    return this._safeMode$.asObservable();
  }

  /**
   * Gets the current data requested from the Reddit API as an observable.
   * @returns An observable that contains the filtered content from the Reddit API.
   */
  public getQuery(): Observable<IRedditQuery> {
    return this._query$;
  }

  /**
   * Gets data from the Reddit API based on a series of defined filtering options.
   * @returns Returns an observable containing the data formatted as {@see IRedditResult}
   */
  private getSubRedditContent({
    name,
    filter,
    page,
    subFilter,
    safeMode,
  }: IRedditRequestOptions): Observable<IRedditResult[]> {
    const path = new URL(
      `${window.location.origin}${RedditService.API_BASE}/${name}/${filter}/.json`
    );
    path.searchParams.append(
      RedditRequestParameters.LIMIT,
      RedditService.MAX_CONTENT_FETCH.toString()
    );

    if (page) {
      path.searchParams.append(RedditRequestParameters.AFTER, page);
    }

    if (subFilter) {
      path.searchParams.append(
        RedditRequestParameters.SORT,
        RedditRequestParameters.TOP
      );
      path.searchParams.append(RedditRequestParameters.T, subFilter);
    }

    return this.http.get<IRedditResultNatural>(path.toString()).pipe(
      map((result) =>
        result.data.children
          .map((item) => item.data)
          .filter(
            (item: IRedditResult) =>
              // Filters inappropriate content from the results if safe mode is enabled (default).
              ((safeMode === SafeMode.ENABLED && !item.over_18) ||
                safeMode === SafeMode.DISABLED) &&
              item.post_hint &&
              (item.post_hint === RedditPostHint.LINK ||
                item.post_hint === RedditPostHint.IMAGE ||
                item.post_hint === RedditPostHint.RICH_VIDEO)
          )
      )
    );
  }
}
