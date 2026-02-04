import {ChangeDetectionStrategy, Component} from '@angular/core'

/**
 * The navbar component displays any top level nav items.
 */
@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {}
