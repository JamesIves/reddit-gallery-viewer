import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedditService } from 'src/services/reddit/reddit.service';
import { Observable } from 'rxjs';
import { RedditFilter, RedditSubFilter } from 'src/app/models/reddit.model';

@Component({
  selector: 'app-sub-filter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sub-filter.component.html',
})
export class SubFilterComponent {
  /**
   * Observable used to inform the current active filter.
   */
  protected readonly activeFilter$: Observable<RedditFilter>;

  /**
   * Observable used to inform the current active sub filter.
   */
  protected readonly activeSubFilter$: Observable<RedditSubFilter>;

  /**
   * @inheritdoc
   */
  protected readonly redditFilter = RedditFilter;

  /**
   * @inheritdoc
   */
  protected readonly redditSubFilter = RedditSubFilter;

  public constructor(private readonly redditService: RedditService) {
    this.activeFilter$ = this.redditService.getSubRedditFilter();
    this.activeSubFilter$ = this.redditService.getSubRedditSubFilter();
  }

  /**
   * Toggles the active sub filter. Only applicable for certain primary filter choices such as Top.
   */
  public toggleSubFilter(event: Event) {
    const e = event.target as HTMLSelectElement;
    if (event) {
      const value = e.value as RedditSubFilter;
      this.redditService.setSubRedditSubFilter(value);
    }
  }
}
