import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { SafeMode } from 'src/app/models/reddit.model';
import { RedditService } from 'src/services/reddit/reddit.service';

/**
 * Search form used to determine which page on Reddit to display.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class SearchComponent {
  protected readonly safeModeSetting = SafeMode;
  protected readonly safeMode$: Observable<SafeMode>;

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly redditService: RedditService
  ) {
    this.safeMode$ = this.redditService.getSafeMode();
  }

  /**
   * Contains all of the search form data points.
   */
  public searchForm = this.formBuilder.group({
    term: '',
  });

  /**
   * Handles submission of the search field.
   */
  public onSubmit(): void {
    if (this.searchForm.value.term) {
      this.redditService.setSubRedditName(this.searchForm.value.term);
    }
  }

  /**
   * Enables and disables the safe mode option.
   * @param enabled The safe mode option to toggle to.
   */
  public toggleSafeMode(enabled: SafeMode): void {
    this.redditService.setSafeMode(enabled);
  }
}
