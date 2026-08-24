import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FloatingWidgetsComponent } from '../floating-widgets/floating-widgets.component';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FloatingWidgetsComponent],
  template: `
    <app-header />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
    <app-floating-widgets />
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - var(--header-height));
      padding-top: var(--header-height);
    }
  `]
})
export class PublicShellComponent {}
