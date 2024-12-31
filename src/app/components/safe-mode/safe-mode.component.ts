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
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './safe-mode.component.html'
})
export class SafeModeComponent {
  /**
   * @inheritdoc
   */
  protected readonly safeModeSetting = SafeMode

  /**
   * Observable that emits if safe mode is enabled/disabled.
   */
  protected readonly safeMode$: Observable<SafeMode>

  /**
   * Determines if the safe mode alert dialog should be shown or not.
   */
  public showAlert = false

  /**
   * @inheritdoc
   * @param redditService The injected reddit service.
   */
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

  /**
   * Toggles the safe mode alert on|off.
   */
  public toggleAlert() {
    this.showAlert = !this.showAlert
  }
}
