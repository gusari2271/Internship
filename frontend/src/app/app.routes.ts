import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ManifestationComponent } from './pages/manifestation/manifestation.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { NewsComponent } from './pages/news/news.component';
import { CareerComponent } from './pages/career/career.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'manifestation', component: ManifestationComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'career', component: CareerComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/forgot-password', component: ForgotPasswordComponent },
  { path: 'admin/reset-password', component: ResetPasswordComponent },
  { path: 'admin/set-password', component: ResetPasswordComponent },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];
