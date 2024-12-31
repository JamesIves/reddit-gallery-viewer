import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {FormBuilder, ReactiveFormsModule} from '@angular/forms'
import {Observable} from 'rxjs'
import {RedditService} from 'src/services/reddit/reddit.service'

/**
 * Search form used to determine which page on Reddit to display.
 */
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule]
})
export class SearchComponent {
  /**
   * An observable containing the selected sub reddit name.
   * Used to push the current Reddit page back to the input placeholder.
   */
  public readonly subRedditName$: Observable<string>

  /**
   * @inheritdoc
   * @param formBuilder Injected form builder from Angular.
   * @param redditService Injected Reddit service.
   */
  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly redditService: RedditService
  ) {
    this.subRedditName$ = this.redditService.getSubRedditName()
  }

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
