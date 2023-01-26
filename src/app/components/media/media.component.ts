import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRedditResult, RedditPostHint } from 'src/app/models/reddit.model';

/**
 * Displays image/video content along with any additional details
 * such as thumbnails/titles/etc.
 */
@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media.component.html',
})
export class MediaComponent {
  protected readonly redditPostHint = RedditPostHint;

  @Input()
  public content?: IRedditResult;
}
