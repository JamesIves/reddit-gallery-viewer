import { Component, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { SearchComponent } from './components/search/search.component';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { FilterComponent } from './components/filter/filter.component';
import { SafeModeComponent } from './components/safe-mode/safe-mode.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    SearchComponent,
    SearchResultsComponent,
    FilterComponent,
    SafeModeComponent,
  ],
  templateUrl: './app.component.html',
  standalone: true,
})
export class AppComponent {
  title = 'reddit-gallery-viewer';
}
