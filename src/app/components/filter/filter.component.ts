import {ChangeDetectionStrategy, Component} from '@angular/core'
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
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter.component.html'
})
export class FilterComponent {
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

  public constructor(
    private readonly redditService: RedditService,
    private readonly loaderService: LoaderService
  ) {
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
