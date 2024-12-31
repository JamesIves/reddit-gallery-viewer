import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core'
import {CommonModule} from '@angular/common'
import {IRedditResult, RedditPostHint} from 'src/app/models/reddit.model'
import {TrustResourcePipe} from 'src/app/pipes/trust-resource/trust-resource.pipe'

/**
 * Displays image/video content along with any additional details
 * such as thumbnails/titles/etc.
 */
@Component({
  selector: 'app-media',
  imports: [CommonModule, TrustResourcePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media.component.html'
})
export class MediaComponent implements OnChanges {
  /**
   * @inheritdoc
   *
   * Used to check against the post hint so the client knows how to render
   * each specific bit of content. For example if it's rich:video we need to
   * use an iframe, whereas for images we need to use an img element.
   */
  protected readonly redditPostHint = RedditPostHint

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
   * Whenever contetn changes, we need to update the image source.
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
  onImageError() {
    if (this.content?.thumbnail) {
      this.imageSrc = this.content.thumbnail
    }
  }
}
