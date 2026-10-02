import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface TeamMember {
  name: string;
  role: string;
  photoUrl: string | null;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent {
  public lang = inject(LanguageService);

  // Seed with empty/placeholder data as requested: "placeholder foto & nama kosong"
  // Let's make it look clean and ready-to-fill
  team: TeamMember[] = [
    {
      name: 'Mardika Dwi Parnadi',
      role: 'Principal Architect & Founder',
      photoUrl:
        'https://res.cloudinary.com/v6zjgt2f/image/upload/v1790754897/Screenshot_2026-09-30_154707.png',
    },
    {
      name: 'I Gede Yoga Pratama',
      role: 'Structural Engineer',
      photoUrl: null,
    },
    {
      name: 'Kadek Dwi Kusuma Widyanatha',
      role: 'Strucutural Engineer',
      photoUrl: null,
    },
    // { name: '—', role: '-', photoUrl: null },
  ];
}
