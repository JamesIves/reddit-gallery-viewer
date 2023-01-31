import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {FormBuilder, ReactiveFormsModule} from '@angular/forms'
import {RedditService} from 'src/services/reddit/reddit.service'

/**
 * Search form used to determine which page on Reddit to display.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class SearchComponent {
  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly redditService: RedditService
  ) {}

  /**
   * Contains all of the search form data points.
   */
  public searchForm = this.formBuilder.group({
    term: ''
  })

  /**
   * Handles submission of the search field.
   */
  public onSubmit(): void {
    if (this.searchForm.value.term) {
      this.redditService.setSubRedditName(this.searchForm.value.term)
    }
  }
}
