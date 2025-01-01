import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {FilterComponent} from './components/filter/filter.component'
import {NavbarComponent} from './components/navbar/navbar.component'
import {SafeModeComponent} from './components/safe-mode/safe-mode.component'
import {SearchResultsComponent} from './components/search-results/search-results.component'
import {SearchComponent} from './components/search/search.component'

/**
 * The primary application access point.
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SearchComponent,
    SearchResultsComponent,
    FilterComponent,
    SafeModeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public readonly title = 'reddit-gallery-viewer'

  /**
   * Highlight where users can find more information.
   */
  public ngOnInit() {
    console.log(
      `%c    ▄█  ▄█   ▄█    █▄     ▄████████    ▄████████ 
%c   ███ ███  ███    ███   ███    ███   ███    ███ 
%c   ███ ███▌ ███    ███   ███    █▀    ███    █▀  
%c   ███ ███▌ ███    ███  ▄███▄▄▄       ███        
%c   ███ ███▌ ███    ███ ▀▀███▀▀▀     ▀███████████ 
%c   ███ ███  ███    ███   ███    █▄           ███ 
%c   ███ ███  ███    ███   ███    ███    ▄█    ███ 
%c█▄ ▄███ █▀    ▀██████▀    ██████████  ▄████████▀  
%c▀▀▀▀▀▀  

%cGitHub: https://github.com/JamesIves/reddit-gallery-viewer
Website: https://jives.dev
      `,
      'color: #e4fa56',
      'color: #e4fa56',
      'color: #e4fa56',
      'color: #a2db47',
      'color: #a2db47',
      'color: #a2db47',
      'color: #52ad3e',
      'color: #52ad3e',
      'color: #52ad3e',
      'color: #f98973'
    )
  }
}
