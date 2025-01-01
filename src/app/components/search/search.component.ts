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
   * Prevents the space key from being entered into the search field.
   */
  public preventSpace(event: KeyboardEvent) {
    if (
      event.key === ' ' &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault()
    }
  }

  /**
   * Handles submission of the search field.
   */
  public onSubmit(event: Event): void {
    if (this.searchForm.value.term) {
      this.redditService.setSubRedditName(this.searchForm.value.term.trim())
    }

    /**
     * Closes the keyboard on mobile devices after submission of the search form.
     * This is necessary because the keyboard does not close automatically on mobile devices.
     */
    event.preventDefault()
    const inputElement = (event.target as HTMLFormElement).querySelector(
      'input[name="term"]'
    ) as HTMLInputElement

    if (inputElement) {
      inputElement.blur()
    }
  }
}
