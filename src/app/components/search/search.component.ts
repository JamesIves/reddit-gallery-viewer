import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {FormBuilder, ReactiveFormsModule} from '@angular/forms'
import {Observable} from 'rxjs'
import {RedditPageType} from 'src/app/models/reddit.model'
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
   * @inheritdoc
   */
  protected readonly redditPageType = RedditPageType

  /**
   * An observable containing the selected sub reddit name.
   * Used to push the current Reddit page back to the input placeholder.
   */
  public readonly subRedditName$: Observable<string>

  /**
   * An observable containing the selected sub reddit page type.
   * Used to push the current Reddit page type back to the input placeholder.
   */
  public readonly redditPageType$: Observable<string>

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
    this.redditPageType$ = this.redditService.getRedditPageType()
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

  /**
   * Toggles the content type subreddit and user content.
   */
  public togglePageType(pageType: RedditPageType) {
    this.redditService.setRedditPageType(pageType)
  }

  /**
   * Clears the search term and resets the subreddit name back to the default.
   * This is used to reset the search field when the user clicks on the clear button.
   */
  public clearSearch(): void {
    this.searchForm.get('term')?.setValue('')

    this.redditService.setSubRedditName('')
  }
}
