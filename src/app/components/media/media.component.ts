import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {CommonModule} from '@angular/common'
import {IRedditResult, RedditPostHint} from 'src/app/models/reddit.model'
import {TrustResourcePipe} from 'src/app/pipes/trust-resource/trust-resource.pipe'
import {SafeHtmlPipe} from 'src/app/pipes/safe-html/safe-html.pipe'

/**
 * Displays image/video content along with any additional details
 * such as thumbnails/titles/etc.
 */
@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, TrustResourcePipe, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media.component.html'
})
export class MediaComponent {
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
   * The inherited content row size. This is used to ensure that
   * media items take up as much as space as their parent container.
   */
  @Input()
  public size?: number
}
