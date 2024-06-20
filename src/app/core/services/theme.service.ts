import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSig = signal('light');

  getThemeSignal(): WritableSignal<string> {
    return this.themeSig;
  }

  toggleTheme() {
    this.themeSig.update((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: 'dark' | 'light') {
    this.themeSig.set(theme);
  }
}
