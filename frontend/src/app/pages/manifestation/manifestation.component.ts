import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-manifestation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manifestation.component.html',
  styleUrls: ['./manifestation.component.scss']
})
export class ManifestationComponent {
  public lang = inject(LanguageService);
}
