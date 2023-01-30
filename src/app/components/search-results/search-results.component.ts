import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { RedditService } from 'src/services/reddit/reddit.service';
import { IRedditQuery } from '../../models/reddit.model';
import { MediaComponent } from '../media/media.component';
import { SubFilterComponent } from '../sub-filter/sub-filter.component';
import { LoaderService } from 'src/services/loader/loader.service';

/**
 * Displays the search result for the specified Reddit page.
 */
@Component({
  selector: 'app-search-results',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaComponent, CommonModule, ScrollingModule, SubFilterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent {
  /**
   * Determines the distance from the bottom before new content is requested.
   */
  private static readonly FETCH_MINIMUM = 3;

  /**
   * Used to keep track of the current viewport scroll depth.
   */
  @ViewChild(CdkVirtualScrollViewport)
  public viewPort?: CdkVirtualScrollViewport;

  /**
   * Observable used to display post content from Reddit.
   */
  protected readonly query$: Observable<IRedditQuery>;

  /**
   * Observable used to inform loading state.
   */
  protected readonly loading$: Observable<boolean>;

  /**
   * @inheritdoc
   * @param redditService The Reddit service used to handle data from the Reddit API.
   */
  public constructor(
    private readonly redditService: RedditService,
    private readonly loaderService: LoaderService
  ) {
    this.query$ = this.redditService.getQuery();
    this.loading$ = this.loaderService.getLoading();
  }

  /**
   * Handles the scroll event for when the virtual scroller reaches a specific
   * index from the bottom. When it does it requests the next page, resulting
   * in additional content being appended to the query$ subscription.
   * @param nextPage The next page to request.
   */
  public onScroll(nextPage?: string): void {
    if (this.viewPort && nextPage) {
      const end = this.viewPort.getRenderedRange().end;
      const total = this.viewPort.getDataLength();

      // If we're close to the bottom, fetch the next page.
      if (end == total - SearchResultsComponent.FETCH_MINIMUM) {
        this.redditService.setSubRedditPage(nextPage);
      }
    }
  }
}
