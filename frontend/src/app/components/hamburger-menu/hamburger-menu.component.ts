import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
  animations: [
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('menuSlide', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('350ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateY(0)' })),
        query('.menu-list li', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('40ms', [
            animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class HamburgerMenuComponent {
  public lang = inject(LanguageService);
  public isMenuOpen = signal(false);

  toggleMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isMenuOpen.set(false);
  }

  setLanguage(langCode: 'en' | 'zh') {
    this.lang.setLanguage(langCode);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: Event) {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}
