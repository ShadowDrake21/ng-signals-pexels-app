import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PexelsService } from './core/services/pexels.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { ThemeService } from './core/services/theme.service';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  themeSig = signal<string>('');

  ngOnInit(): void {
    this.themeSig = this.themeService.getThemeSignal();
  }
}
