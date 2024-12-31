import {CdkVirtualScrollViewport, ScrollingModule} from '@angular/cdk/scrolling'
import {CommonModule} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild
} from '@angular/core'
import {debounceTime, fromEvent, Observable, Subscription} from 'rxjs'
import {BreakPoint, ViewPortSize} from 'src/app/models/viewport.enum'
import {LoaderService} from 'src/services/loader/loader.service'
import {RedditService} from 'src/services/reddit/reddit.service'
import {IRedditQuery} from '../../models/reddit.model'
import {MediaComponent} from '../media/media.component'
import {SubFilterComponent} from '../sub-filter/sub-filter.component'

/**
 * Displays the search result for the specified Reddit page.
 */
@Component({
  selector: 'app-search-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaComponent, CommonModule, ScrollingModule, SubFilterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
  /**
   * Determines the distance from the bottom before new content is requested.
   */
  private static readonly FETCH_MINIMUM = 3

  /**
   * Used to keep track of the current viewport scroll depth.
   */
  @ViewChild(CdkVirtualScrollViewport)
  public viewPort?: CdkVirtualScrollViewport

  /**
   * This is a pre-determined, hardcoded value that defines
   * how much space each item in the virtual scroller takes up
   * at the Small breakpoint.
   */
  private readonly SM_SIZE = 450

  /**
   * This is a pre-determined, hardcoded value that defines
   * how much space each item in the virtual scroller takes up
   * at the Medium breakpoint.
   */
  private readonly MD_SIZE = 600

  /**
   * This is a pre-determined, hardcoded value that defines
   * how much space each item in the virtual scroller takes up
   * at the Large breakpoint.
   */
  private readonly LG_SIZE = 1264

  /**
   * Observable used to display post content from Reddit.
   */
  protected readonly query$: Observable<IRedditQuery>

  /**
   * Observable used to inform loading state.
   */
  protected readonly loading$: Observable<boolean>

  /**
   * Observable that tracks resize events.
   */
  protected resizeObservable$?: Observable<Event>

  /**
   * Subscription which is used to inform resizeObservable.
   */
  protected resizeSubscription$?: Subscription

  /**
   * The current viewport breakpoint size.
   */
  private viewPortSize: ViewPortSize = ViewPortSize.LG

  /**
   * The size of the item.
   */
  public itemSize = this.LG_SIZE

  /**
   * @inheritdoc
   * @param redditService The Reddit service used to handle data from the Reddit API.
   */
  public constructor(
    private readonly redditService: RedditService,
    private readonly loaderService: LoaderService
  ) {
    this.query$ = this.redditService.getQuery()
    this.loading$ = this.loaderService.getLoading()
  }

  /**
   * @inheritdoc
   * Registers a subscription that tracks resize events to ensure
   * things are appropriately sized and optimized per breakpoint.
   * As we use a fixed height for performance reasons, we want to make sure
   * that not too much vertical space is taken up on mobile devices.
   */
  public ngOnInit(): void {
    this.determineItemSize()

    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.determineItemSize()
      })
  }

  /**
   * Keeps track of the current item size and updates it
   * based on existing viewport size & breakpoint markers.
   */
  public determineItemSize() {
    if (
      window.innerWidth < BreakPoint.MD &&
      this.viewPortSize !== ViewPortSize.MD
    ) {
      this.itemSize = this.MD_SIZE
      this.viewPortSize = ViewPortSize.MD
      this.viewPort?.checkViewportSize()
    } else if (
      window.innerHeight < BreakPoint.SM &&
      this.viewPortSize !== ViewPortSize.SM
    ) {
      this.itemSize = this.SM_SIZE
      this.viewPortSize = ViewPortSize.SM
      this.viewPort?.checkViewportSize()
    } else if (
      window.innerWidth > BreakPoint.MD &&
      this.viewPortSize !== ViewPortSize.LG
    ) {
      this.itemSize = this.LG_SIZE
      this.viewPortSize = ViewPortSize.LG
      this.viewPort?.checkViewportSize()
    }
  }

  /**
   * Handles the scroll event for when the virtual scroller reaches a specific
   * index from the bottom. When it does it requests the next page, resulting
   * in additional content being appended to the query$ subscription.
   * @param nextPage The next page to request.
   */
  public onScroll(nextPage?: string): void {
    if (this.viewPort && nextPage) {
      const end = this.viewPort.getRenderedRange().end
      const total = this.viewPort.getDataLength()

      // If we're close to the bottom, fetch the next page.
      if (end >= total - SearchResultsComponent.FETCH_MINIMUM) {
        this.redditService.setSubRedditPage(nextPage)
      }
    }
  }

  /**
   * Handles the interaction with the scroll to top button.
   */
  public scrollToTop() {
    this.viewPort?.scrollToIndex(0)
  }
}
