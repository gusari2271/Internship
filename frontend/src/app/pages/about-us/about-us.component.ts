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
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  public lang = inject(LanguageService);

  // Seed with empty/placeholder data as requested: "placeholder foto & nama kosong"
  // Let's make it look clean and ready-to-fill
  team: TeamMember[] = [
    { name: '—', role: 'Principal Architect & Founder', photoUrl: null },
    { name: '—', role: 'Lead Design Associate', photoUrl: null },
    { name: '—', role: 'Project Architect', photoUrl: null },
    { name: '—', role: '3D Visualization Specialist', photoUrl: null }
  ];
}
