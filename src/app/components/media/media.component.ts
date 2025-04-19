import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import {CommonModule, DecimalPipe} from '@angular/common'
import {
  IRedditResult,
  RedditPageType,
  RedditPostHint
} from 'src/app/models/reddit.model'
import {TrustResourcePipe} from 'src/app/pipes/trust-resource/trust-resource.pipe'
import {RelativeTimePipe} from 'src/app/pipes/relative-time/relative-time.pipe'
import {RedditService} from 'src/services/reddit/reddit.service'
import {Observable} from 'rxjs'
import {GalleryComponent} from '../gallery/gallery.component'
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling'

/**
 * Displays image/video content along with any additional details
 * such as thumbnails/titles/etc.
 */
@Component({
  selector: 'app-media',
  imports: [
    CommonModule,
    TrustResourcePipe,
    DecimalPipe,
    RelativeTimePipe,
    GalleryComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media.component.html'
})
export class MediaComponent implements OnChanges {
  /**
   * Used to keep track of the current viewport scroll depth.
   */
  @ViewChild(CdkVirtualScrollViewport)
  public viewPort?: CdkVirtualScrollViewport

  /**
   * @inheritdoc
   */
  protected readonly redditPageType = RedditPageType

  /**
   * @inheritdoc
   *
   * Used to check against the post hint so the client knows how to render
   * each specific bit of content. For example if it's rich:video we need to
   * use an iframe, whereas for images we need to use an img element.
   */
  protected readonly redditPostHint = RedditPostHint

  /**
   * An observable containing the selected sub reddit page type.
   * Used to push the current Reddit page type back to the input placeholder.
   */
  public readonly redditPageType$: Observable<string>

  /**
   * @inheritdoc
   * @param clipboard The injected clipboard service.
   */
  public constructor(private readonly redditService: RedditService) {
    this.redditPageType$ = this.redditService.getRedditPageType()
  }

  /**
   * The content object from Reddit.
   * For more details {@see IRedditResult}.
   */
  @Input()
  public content?: IRedditResult

  /**
   * The image source to display.
   */
  public imageSrc?: string

  /**
   * The inherited content row size. This is used to ensure that
   * media items take up as much as space as their parent container.
   */
  @Input()
  public size?: number

  /**
   * Whenever content changes, we need to update the image source.
   * This is done to ensure that the image source is always up to date
   * with the latest content, and so we can track for any errors.
   */
  public ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['content']) {
      this.imageSrc = this.content?.url
    }
  }

  /**
   * If the image fails to load, we can use the thumbnail as a fallback if it exists.
   */
  public onImageError(): void {
    if (this.content?.thumbnail) {
      this.imageSrc = this.content.thumbnail
    }
  }

  /**
   * Switches the current page type to the selected one.
   * When a user clicks the button they can view more content from the user or subreddit.
   */
  public viewMore(pageType: RedditPageType, author: string): void {
    // Scrolls the user to the top as the feed is being reset.
    window.scrollTo(0, 0)

    this.redditService.setRedditPageType(pageType)
    this.redditService.setSubRedditName(author)
  }

  /**
   * Animates the button when the user touches it on mobile.
   * This is done to provide feedback to the user that the button has been pressed.
   */
  public onTouchStart(event: Event): void {
    const target = event.target as HTMLElement
    target.classList.add('activate')
  }

  /**
   * Removes the animation class when the user releases the button.
   * This is done to provide feedback to the user that the button has been released.
   */
  public onTouchEnd(event: Event): void {
    const target = event.target as HTMLElement
    target.classList.remove('activate')
  }
}
