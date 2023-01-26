import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedditFilter, RedditSubFilter } from 'src/app/models/reddit.model';
import { RedditService } from 'src/services/reddit/reddit.service';

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
  protected readonly redditSubFilter = RedditSubFilter;

  public readonly activeFilter;
  public readonly activeSubFilter;

  public constructor(private readonly redditService: RedditService) {
    this.activeFilter = this.redditService.getSubRedditFilter();
    this.activeSubFilter = this.redditService.getSubRedditSubFilter();
  }

  /**
   * Toggles the active filter option.
   * @param filter The filter option, {@see RedditFilter} for choices.
   */
  public toggleFilter(filter: RedditFilter): void {
    this.redditService.setSubRedditFilter(filter);
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
