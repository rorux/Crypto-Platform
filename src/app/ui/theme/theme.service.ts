import { Injectable, signal } from '@angular/core';
import { THEME_LOCAL_STORAGE_ITEM } from '../../constants';
import { Theme } from './types';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    public currentTheme = signal<Theme>(this.getSavedTheme());
    public isDarkTheme = signal<boolean>(this.currentTheme() === 'dark');

    constructor() {
        this.loadInitialTheme();
    }

    public toggleTheme(): void {
        const newTheme: Theme = this.currentTheme() === 'default' ? 'dark' : 'default';
        this.setTheme(newTheme);
    }

    private setTheme(theme: Theme): void {
        this.loadThemeCss(theme);

        document.documentElement.classList.remove('default', 'dark');
        document.documentElement.classList.add(theme);

        this.removeOldTheme(theme === 'default' ? 'dark' : 'default');

        this.currentTheme.set(theme);
        this.isDarkTheme.set(theme === 'dark');

        localStorage.setItem(THEME_LOCAL_STORAGE_ITEM, theme);
    }

    private loadInitialTheme(): void {
        const theme = this.currentTheme();
        document.documentElement.classList.add(theme);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${theme}.css`;
        link.id = theme;
        document.head.appendChild(link);
    }

    private loadThemeCss(theme: Theme): void {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${theme}.css`;
        link.id = theme;
        document.head.appendChild(link);
    }

    private removeOldTheme(oldTheme: Theme): void {
        const oldLink = document.getElementById(oldTheme);
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
    }

    private getSavedTheme(): Theme {
        const saved = localStorage.getItem(THEME_LOCAL_STORAGE_ITEM) as Theme;
        if (saved) return saved;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'default';
    }
}
