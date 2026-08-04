import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface NewsItem {
  id: number;
  date: string;
  category: string;
  title: string;
  summary: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  public lang = inject(LanguageService);

  // Seed with empty array as requested: "kosongkan datanya"
  newsList: NewsItem[] = [];
}
