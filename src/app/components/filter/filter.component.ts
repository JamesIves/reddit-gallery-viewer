import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedditFilter, RedditSubFilter } from 'src/app/models/reddit.model';
import { RedditService } from 'src/services/reddit/reddit.service';
import { Observable } from 'rxjs';

/**
 * Displays a series of filtering options used to display which content
 * within a specific page to display.
 */
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter.component.html',
})
export class FilterComponent {
  protected readonly redditFilter = RedditFilter;

  public readonly activeFilter: Observable<RedditFilter>;

  public constructor(private readonly redditService: RedditService) {
    this.activeFilter = this.redditService.getSubRedditFilter();
  }

  /**
   * Toggles the active filter option.
   * @param filter The filter option, {@see RedditFilter} for choices.
   */
  public toggleFilter(filter: RedditFilter): void {
    this.redditService.setSubRedditFilter(filter);
  }
}
