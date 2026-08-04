import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ManifestationComponent } from './pages/manifestation/manifestation.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { NewsComponent } from './pages/news/news.component';
import { CareerComponent } from './pages/career/career.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'manifestation', component: ManifestationComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'career', component: CareerComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: '**', redirectTo: '' }
];
