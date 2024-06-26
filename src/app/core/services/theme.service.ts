// angular stuff
import { Injectable, signal, WritableSignal } from '@angular/core';

// utils
import {
  retrieveItemFromLC,
  setItemInLC,
} from '../../shared/utils/localStorage.utils';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSig = signal('light');

  constructor() {
    this.loadSavedTheme();
  }

  getThemeSignal(): WritableSignal<string> {
    return this.themeSig;
  }

  toggleTheme() {
    this.themeSig.update((prev) => (prev === 'dark' ? 'light' : 'dark'));
    this.saveTheme();
  }

  setTheme(theme: 'dark' | 'light') {
    this.themeSig.set(theme);
  }

  loadSavedTheme() {
    const savedTheme: 'dark' | 'light' = retrieveItemFromLC('theme');

    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  saveTheme() {
    setItemInLC('theme', this.themeSig());
  }
}
