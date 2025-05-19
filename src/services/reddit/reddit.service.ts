import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BehaviorSubject, combineLatest, map, Observable, of} from 'rxjs'
import {catchError, mergeMap, scan, startWith, switchMap} from 'rxjs/operators'
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
  RedditPageType
} from 'src/app/models/reddit.model'

/**
 * Service which is used to communicate with the Reddit API.
 */
@Injectable({
  providedIn: 'root'
})
export class RedditService {
  private static readonly API_BASE = 'https://api.reddit.com'
  private static readonly MAX_CONTENT_FETCH = 24
  private static readonly DEFAULT_SUBREDDIT = 'cats'
  private static readonly DEFAULT_PAGE = 't3_'

  /**
   * BehaviorSubject which houses the current safe mode settings.
   */
  private readonly _safeMode$ = new BehaviorSubject<SafeMode>(SafeMode.ENABLED)

  /**
   * BehaviorSubject which houses the current subreddit name.
   */
  private readonly _subRedditName$ = new BehaviorSubject(
    RedditService.DEFAULT_SUBREDDIT
  )

  /**
   * BehaviorSubject which houses the current page.
   */
  private readonly _subRedditPage$ = new BehaviorSubject(
    RedditService.DEFAULT_PAGE
  )

  /**
   * BehaviorSubject which houses the currently set filter.
   */
  private readonly _subRedditFilter$ = new BehaviorSubject(RedditFilter.HOT)

  /**
   * BehaviorSubject which houses the currently set sub filter.
   */
  private readonly _subRedditSubFilter$ = new BehaviorSubject<RedditSubFilter>(
    RedditSubFilter.ALL
  )

  /**
   * BehaviorSubject which houses the currently set page type.
   * This can be used to query for specific page types such as subreddit or user pages.
   */
  private readonly _redditPageType$ = new BehaviorSubject<RedditPageType>(
    RedditPageType.SUBREDDIT
  )

  /**
   * The query$ observable is the main mechanism of the app.
   * This observable will watch for changes to the other values such as page/name etc
   * and re-fetch data based on input changes. This observable can be subscribed to
   * within a component to generate a list of content using the async pipe.
   */
  private readonly _query$: Observable<IRedditQuery>

  /**
   * On construction the _query$ observable is bound, which
   * checks for any changes to either name, filter, subfilter, safemode or page.
   * If page changes, we append the last emission to the current one,
   * and return a combined array, resulting in an infinite scroll.
   * If the others are changed, we assume that a user has requested
   * an updated set of content, and instead return only that emission.
   * This machinery is what powers the majority of the application,
   * and as a result _query$ can be leveraged in a template with the
   * combination of the async pipe to fetch the most up to date content.
   */
  public constructor(private readonly http: HttpClient) {
    this._query$ = combineLatest([
      this.getSubRedditName(),
      this.getSubRedditFilter(),
      this.getSubRedditSubFilter(),
      this.getSafeMode()
    ]).pipe(
      switchMap(([name, filter, subFilter, safeMode]) =>
        this.getSubRedditPage().pipe(
          mergeMap(page =>
            this.getSubRedditContent({
              name,
              filter,
              page,
              subFilter,
              safeMode
            }).pipe(
              catchError(() => {
                /**
                 * If the stream catches an error return an empty array.
                 * For the sake of this demo we'll just assume that the subreddit
                 * has no content if it doesn't exist.
                 */
                return of([])
              })
            )
          ),

          /**
           * If the page observable emits instead of creating a new list it
           * will instead concat the previous results together with the new ones.
           * This is used for infinite scrolling pagination.
           */
          scan(
            (acc, curr) => {
              const newResults = curr.filter(
                item =>
                  !acc.results.some(existingItem => existingItem.id === item.id)
              )

              return {
                results: acc.results.concat(newResults),
                nextPage: curr[curr.length - 1]?.id
              }
            },
            {
              results: [] as IRedditResult[],
              nextPage: undefined
            } as IRedditQuery
          ),
          /**
           * Whenever a user requests a fresh set of content (ie changing the filter, subfilter, subreddit, etc)
           * we start with an empty array to prevent lingering content from previous pages.
           * It also gives instant feedback to the user that new content is being fetched by clearing the list.
           */
          startWith({results: [], nextPage: undefined} as IRedditQuery)
        )
      )
    )
  }

  /**
   * Sets the name of subreddit, for example 'cats' or 'fish'.
   * @param name The name of the subreddit.
   */
  public setSubRedditName(name: string): void {
    this.setSubRedditPage(RedditService.DEFAULT_PAGE)
    this._subRedditName$.next(name)
  }

  /**
   * Sets the name of the subreddit filter, for example 'hot' or 'new'.
   * @param filter The name of the filter {@see RedditFilter} for options.
   */
  public setSubRedditFilter(filter: RedditFilter): void {
    /** On each filter change reset the page back to default value
     * to prevent lingering pages. */
    this.setSubRedditPage(RedditService.DEFAULT_PAGE)

    this._subRedditFilter$.next(filter)
  }

  /**
   * Sets the name of the page to display. The Reddit API allows you to specify
   * at which point you want to fetch after. As a result we index the page name
   * after each fetch and use it to fetch the next set of paginated content.
   * @param page The name of the page to fetch content after.
   */
  public setSubRedditPage(page: string): void {
    this._subRedditPage$.next(`${RedditService.DEFAULT_PAGE}${page}`)
  }

  /**
   * Sets the name of the sub filter to display. Sub filters apply to specific
   * primary filter options, such as 'Top' so you can view top content of all time,
   * and days/months/year etc.
   * @param filter The name of the sub filter to display, {@see RedditSubFilter} for options.
   */
  public setSubRedditSubFilter(filter: RedditSubFilter): void {
    this.setSubRedditPage(RedditService.DEFAULT_PAGE)
    this._subRedditSubFilter$.next(filter)
  }

  /**
   * Sets the safe mode toggle on|off. Certain content from the Reddit
   * API is marked as inappropriate for minors, this flag is used to ensure
   * content is obfuscated before a user requests to see it.
   * @param enabled The safe mode flag, {@see SafeMode} for options.
   */
  public setSafeMode(enabled: SafeMode): void {
    this._safeMode$.next(enabled)
  }

  /**
   * Sets the sub reddit page type. This is used to determine which
   * page type to display, such as subreddit or user.
   * @param type The type of page to display, {@see RedditSubFilter} for options.
   */
  public setRedditPageType(type: RedditPageType): void {
    this._redditPageType$.next(type)
  }

  /**
   * Gets the sub reddit filter option as an observable.
   * @returns An observable that can translate the currently set filter option.
   */
  public getSubRedditFilter(): Observable<RedditFilter> {
    return this._subRedditFilter$.asObservable()
  }

  /**
   * Gets the sub reddit page type option as an observable.
   * @returns An observable that can translate the currently set page type option.
   */
  public getRedditPageType(): Observable<RedditPageType> {
    return this._redditPageType$.asObservable()
  }

  /**
   * Gets the sub reddit sub filter option as an observable.
   * @returns An observable that can translate the currently set sub filter option.
   */
  public getSubRedditSubFilter(): Observable<RedditSubFilter> {
    return this._subRedditSubFilter$.asObservable()
  }

  /**
   * Gets the sub reddit name option as an observable.
   * @returns An observable that contains the currently set name.
   */
  public getSubRedditName(): Observable<string> {
    return this._subRedditName$.asObservable()
  }

  /**
   * Gets the current page being viewed as an observable.
   * @returns An observable that can contains the currently set page.
   */
  public getSubRedditPage(): Observable<string> {
    return this._subRedditPage$.asObservable()
  }

  /**
   * Gets the currently set safe mode option as an observable.
   * @returns An observable that can translate the safe mode option.
   */
  public getSafeMode() {
    return this._safeMode$.asObservable()
  }

  /**
   * Gets the current data requested from the Reddit API as an observable.
   * @returns An observable that contains the filtered content from the Reddit API.
   */
  public getQuery(): Observable<IRedditQuery> {
    return this._query$
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
    safeMode
  }: IRedditRequestOptions): Observable<IRedditResult[]> {
    const pageType = this._redditPageType$.getValue()
    const path = new URL(
      `${RedditService.API_BASE}/${pageType}/${name}${filter !== RedditFilter.ALL ? `/${filter}` : ''}.json?raw_json=1`
    )
    path.searchParams.append(
      RedditRequestParameters.LIMIT,
      RedditService.MAX_CONTENT_FETCH.toString()
    )

    // If page is provided it gets appended to the query to ensure we're not re-fetching the same content.
    if (page) {
      path.searchParams.append(RedditRequestParameters.AFTER, page)
    }

    if (subFilter) {
      path.searchParams.append(
        RedditRequestParameters.SORT,
        RedditRequestParameters.TOP
      )
      path.searchParams.append(RedditRequestParameters.T, subFilter)
    }

    console.info('✅ Making request to:', path.toString())

    return this.http.get<IRedditResultNatural>(path.toString()).pipe(
      map(result =>
        result.data.children
          .map(item => item.data)
          .filter((item: IRedditResult) => {
            /**
             * Ensure the content is safe for viewing based on the current safe mode settings.
             */
            const safeForViewing =
              (safeMode === SafeMode.ENABLED && !item.over_18) ||
              safeMode === SafeMode.DISABLED

            /**
             * Check if the content is valid for viewing (ie if the app can display it).
             */
            const isValidContent =
              item.is_gallery ||
              (item.post_hint &&
                ((item.post_hint === RedditPostHint.LINK &&
                  item.secure_media_embed &&
                  item.secure_media_embed.media_domain_url) ||
                  item.post_hint === RedditPostHint.IMAGE ||
                  item.post_hint === RedditPostHint.RICH_VIDEO))

            /**
             * For user pages we need to ensure that the author matches the current user.
             * This is used to filter out content that doesn't belong to the user, such as reposts, comments, etc.
             */
            const authorMatches =
              pageType !== RedditPageType.USER ||
              item.author.toLowerCase() === name.toLowerCase()

            return safeForViewing && isValidContent && authorMatches
          })
      )
    )
  }
}
