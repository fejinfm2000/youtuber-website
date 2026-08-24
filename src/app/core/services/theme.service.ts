import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'creatorhub_theme';
  
  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Apply theme on init and whenever it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  toggle(): void {
    this.currentTheme.set(this.currentTheme() === 'dark' ? 'light' : 'dark');
    localStorage.setItem(this.STORAGE_KEY, this.currentTheme());
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    // Default: respect OS preference
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
