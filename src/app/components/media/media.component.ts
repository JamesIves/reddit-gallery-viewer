import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core'
import {CommonModule, DecimalPipe} from '@angular/common'
import {
  IRedditResult,
  RedditPageType,
  RedditPostHint,
  VideoPlatform
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
   * Injected Reddit service for managing page types and subreddit names.
   */
  private readonly redditService = inject(RedditService)

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
   * Video platform types for template usage
   */
  protected readonly videoPlatform = VideoPlatform

  /**
   * @inheritdoc
   */
  public constructor() {
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
   * Detects the video platform type from Reddit content
   */
  public getVideoPlatform(content: IRedditResult): VideoPlatform {
    if (!content) return VideoPlatform.OTHER

    const domain = content.domain || ''
    const secure_media_type = content.secure_media?.type || ''

    /**
     * YouTube detection
     */
    if (
      domain.includes('youtube.com') ||
      domain.includes('youtu.be') ||
      secure_media_type.includes('youtube')
    ) {
      return VideoPlatform.YOUTUBE
    }

    /**
     * Twitch detection
     */
    if (
      domain.includes('twitch.tv') ||
      secure_media_type.includes('twitch') ||
      (content.secure_media_embed?.content || '').includes('twitch')
    ) {
      return VideoPlatform.TWITCH
    }

    return VideoPlatform.OTHER
  }

  /**
   * Extracts video ID and builds proper embed URL for the video platform
   */
  public getVideoEmbedUrl(content: IRedditResult): string | null {
    const platform = this.getVideoPlatform(content)

    switch (platform) {
      case VideoPlatform.YOUTUBE:
        return this.getYouTubeEmbedUrl(content)
      case VideoPlatform.TWITCH:
        return this.getTwitchEmbedUrl(content)
      default:
        return content.secure_media_embed?.media_domain_url || null
    }
  }

  /**
   * Extracts YouTube video ID and returns proper embed URL
   */
  private getYouTubeEmbedUrl(content: IRedditResult): string | null {
    const videoId = this.extractYouTubeId(content)
    if (!videoId) return null

    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
  }

  /**
   * Extracts Twitch video/clip ID and returns proper embed URL
   */
  private getTwitchEmbedUrl(content: IRedditResult): string | null {
    const {clipId, videoId, channelName} = this.extractTwitchInfo(content)

    if (clipId) {
      return `https://clips.twitch.tv/embed?clip=${clipId}&parent=${window.location.hostname}&autoplay=false`
    } else if (videoId) {
      return `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}&autoplay=false`
    } else if (channelName) {
      return `https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}&autoplay=false`
    }

    return null
  }

  /**
   * Extracts YouTube video ID from various URL formats
   */
  private extractYouTubeId(content: IRedditResult): string | null {
    /**
     * Try to extract from URL
     */
    if (content.url) {
      const urlMatch = content.url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
      )
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1]
      }
    }

    /**
     * Try to extract from embed HTML
     */
    if (content.secure_media?.oembed?.html) {
      const embedMatch = content.secure_media.oembed.html.match(
        /youtube\.com\/embed\/([^"&?/\s]{11})/i
      )
      if (embedMatch && embedMatch[1]) {
        return embedMatch[1]
      }
    }

    return null
  }

  /**
   * Extracts Twitch video/clip ID or channel name from content
   */
  private extractTwitchInfo(content: IRedditResult): {
    clipId?: string
    videoId?: string
    channelName?: string
  } {
    const result: {clipId?: string; videoId?: string; channelName?: string} = {}

    /**
     * Extract from URL
     */
    if (content.url) {
      /**
       * Check for clips - fixed escapes
       */
      const clipMatch =
        content.url.match(/twitch\.tv\/\w+\/clip\/([a-zA-Z0-9_-]+)/i) ||
        content.url.match(/clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/i)
      if (clipMatch && clipMatch[1]) {
        result.clipId = clipMatch[1]
        return result
      }

      /**
       * Check for videos - fixed escapes
       */
      const videoMatch = content.url.match(/twitch\.tv\/videos\/(\d+)/i)
      if (videoMatch && videoMatch[1]) {
        result.videoId = videoMatch[1]
        return result
      }

      /**
       * Check for channels - fixed escapes
       */
      const channelMatch = content.url.match(/twitch\.tv\/([a-zA-Z0-9_]+)$/i)
      if (channelMatch && channelMatch[1]) {
        result.channelName = channelMatch[1]
        return result
      }
    }

    /**
     * Extract from embed HTML if direct URL extraction fails
     */
    if (content.secure_media?.oembed?.html) {
      const html = content.secure_media.oembed.html

      /**
       * Try to extract clip ID
       */
      const clipEmbedMatch = html.match(/clip=([a-zA-Z0-9_-]+)/i)
      if (clipEmbedMatch && clipEmbedMatch[1]) {
        result.clipId = clipEmbedMatch[1]
        return result
      }

      /**
       * Try to extract video ID
       */
      const videoEmbedMatch = html.match(/video=(\d+)/i)
      if (videoEmbedMatch && videoEmbedMatch[1]) {
        result.videoId = videoEmbedMatch[1]
        return result
      }

      /**
       * Try to extract channel name
       */
      const channelEmbedMatch = html.match(/channel=([a-zA-Z0-9_]+)/i)
      if (channelEmbedMatch && channelEmbedMatch[1]) {
        result.channelName = channelEmbedMatch[1]
        return result
      }
    }

    return result
  }
}
