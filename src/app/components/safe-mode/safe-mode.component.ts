import {ChangeDetectionStrategy, Component} from '@angular/core'
import {CommonModule} from '@angular/common'
import {SafeMode} from 'src/app/models/reddit.model'
import {Observable} from 'rxjs'
import {RedditService} from 'src/services/reddit/reddit.service'

/**
 * Toggles safe mode on/off. With safe mode disabled any content
 * marked as 18+ will no longer be filtered from the {@see RedditService}
 * query$ data stream.
 */
@Component({
  selector: 'app-safe-mode',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './safe-mode.component.html'
})
export class SafeModeComponent {
  protected readonly safeModeSetting = SafeMode
  protected readonly safeMode$: Observable<SafeMode>
  public showAlert = false

  public constructor(private readonly redditService: RedditService) {
    this.safeMode$ = this.redditService.getSafeMode()
  }

  /**
   * Enables and disables the safe mode option.
   * @param enabled The safe mode option to toggle to.
   */
  public toggleSafeMode(enabled: SafeMode): void {
    this.redditService.setSafeMode(enabled)

    if (enabled === this.safeModeSetting.DISABLED) {
      this.toggleAlert()
    }
  }

  public toggleAlert() {
    this.showAlert = !this.showAlert
  }
}
