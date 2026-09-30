import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface JobOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
}

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
})
export class CareerComponent {
  public lang = inject(LanguageService);

  openings: JobOpening[] = [
    {
      id: 'job-01',
      title: 'Junior Architect',
      type: 'Full-time',
      location: 'Bali Office / Remote Hybrid',
      description:
        'We are seeking a junior designer with strong rendering skills, knowledge of Rhino/Grasshopper, and a passion for spatial reduction. You will work closely with the design lead on concept formulations and physical models.',
    },
    {
      id: 'job-02',
      title: 'Architectural Intern',
      type: 'Internship (3-6 Months)',
      location: 'Bali Office / Remote Hybrid',
      description:
        'Open to current architecture students or recent graduates. Strong attention to detail, precision in model making, and familiarity with CAD suites is required.',
    },
    {
      id: 'job-03',
      title: 'Social Media Manager',
      type: 'Full-time',
      location: 'Bali Office / Remote Hybrid',
      description:
        'Open to current architecture students or recent graduates. Strong attention to detail, precision in model making, and familiarity with CAD suites is required.',
    },
  ];
}
