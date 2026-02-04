import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core'
import {FormBuilder, ReactiveFormsModule} from '@angular/forms'
import {distinctUntilChanged, Observable, Subject, takeUntil} from 'rxjs'
import {RedditPageType} from 'src/app/models/reddit.model'
import {RedditService} from 'src/services/reddit/reddit.service'

/**
 * Component for the search input field.
 * Allows users to search for subreddits or users.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SearchComponent implements OnDestroy {
  /**
   * Enum for Reddit page types (e.g., SUBREDDIT or USER).
   */
  protected readonly redditPageType = RedditPageType

  /**
   * Observable containing the current subreddit name.
   * Used to dynamically update the input placeholder.
   */
  public readonly subRedditName$: Observable<string>

  /**
   * Observable containing the current Reddit page type.
   * Used to toggle between subreddit and user searches.
   */
  public readonly redditPageType$: Observable<string>

  /**
   * Subject to handle unsubscription on destroy.
   */
  private destroy$ = new Subject<void>()

  /**
   * Constructor for the SearchComponent.
   * @param formBuilder The Angular FormBuilder service for creating forms.
   * @param redditService The RedditService for managing subreddit and page type state.
   */
  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly redditService: RedditService
  ) {
    this.subRedditName$ = this.redditService
      .getSubRedditName()
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))

    this.subRedditName$.subscribe(() => {
      /**
       * Clear the input value when subreddit changes, but keep the placeholder
       */
      this.searchForm.get('term')?.setValue('')

      /**
       * Reset the dirty/touched state
       */
      this.searchForm.get('term')?.markAsPristine()
      this.searchForm.get('term')?.markAsUntouched()
    })

    this.redditPageType$ = this.redditService.getRedditPageType()

    this.redditPageType$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(pageType => {
        // Update the form control value
        this.searchForm.get('pageType')?.setValue(pageType as RedditPageType)
      })
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   */
  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Reactive form for managing the search input and page type.
   */
  public searchForm = this.formBuilder.group({
    term: '', // The search term input
    pageType: RedditPageType.SUBREDDIT // Default page type is SUBREDDIT
  })

  /**
   * Prevents spaces from being entered into the search input.
   * @param event The keyboard event triggered by the user.
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
   * Handles the form submission event.
   * Updates the subreddit name and page type in the RedditService.
   */
  public onSubmit(event: Event): void {
    if (this.searchForm.value.pageType) {
      this.redditService.setRedditPageType(this.searchForm.value.pageType)
    }

    if (this.searchForm.value.term) {
      this.redditService.setSubRedditName(this.searchForm.value.term.trim())
    }

    if (event) {
      event.preventDefault()
    }

    const inputElement = (event?.target as HTMLFormElement)?.querySelector(
      'input[name="term"]'
    ) as HTMLInputElement

    if (inputElement) {
      inputElement.blur()
    }
  }

  /**
   * Toggles the current page type between SUBREDDIT and USER.
   * Updates the pageType value in the reactive form.
   */
  public togglePageType(): void {
    const currentPageType = this.searchForm.get('pageType')?.value
    const newPageType =
      currentPageType === RedditPageType.SUBREDDIT
        ? RedditPageType.USER
        : RedditPageType.SUBREDDIT
    this.searchForm.get('pageType')?.setValue(newPageType)
  }

  /**
   * Clears the search input field.
   */
  public clearSearch(): void {
    this.searchForm.get('term')?.setValue('')
  }
}
