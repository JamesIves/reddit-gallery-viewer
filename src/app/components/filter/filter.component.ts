import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RedditFilter} from 'src/app/models/reddit.model'
import {RedditService} from 'src/services/reddit/reddit.service'
import {Observable} from 'rxjs'
import {LoaderService} from 'src/services/loader/loader.service'

/**
 * Displays a series of filtering options used to display which content
 * within a specific page to display.
 */
@Component({
  selector: 'app-filter',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter.component.html'
})
export class FilterComponent {
  /**
   * Injected Reddit service for managing filter state.
   */
  private readonly redditService = inject(RedditService)

  /**
   * Injected Loader service for managing loading state.
   */
  private readonly loaderService = inject(LoaderService)

  /**
   * @inheritdoc
   */
  protected readonly redditFilter = RedditFilter

  /**
   * Observable used to display the current loading state.
   */
  protected readonly loading$: Observable<boolean>

  /**
   * Observable used to indicate the currently active filter.
   */
  public readonly activeFilter: Observable<RedditFilter>

  /**
   * @inheritdoc
   */
  public constructor() {
    this.activeFilter = this.redditService.getSubRedditFilter()
    this.loading$ = this.loaderService.getLoading()
  }

  /**
   * Toggles the active filter option.
   * @param filter The filter option, {@see RedditFilter} for choices.
   */
  public toggleFilter(filter: RedditFilter): void {
    this.redditService.setSubRedditFilter(filter)
  }
}
