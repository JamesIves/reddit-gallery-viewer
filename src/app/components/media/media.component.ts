import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRedditResult, RedditPostHint } from 'src/app/models/reddit.model';
import { TrustResourcePipe } from 'src/app/pipes/trust-resource/trust-resource.pipe';

/**
 * Displays image/video content along with any additional details
 * such as thumbnails/titles/etc.
 */
@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, TrustResourcePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media.component.html',
})
export class MediaComponent {
  protected readonly redditPostHint = RedditPostHint;

  @Input()
  public content?: IRedditResult;
}
