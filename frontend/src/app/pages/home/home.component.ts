import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CubeFieldComponent } from '../../components/cube-field/cube-field.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CubeFieldComponent],
  template: `
    <div class="home-page-container">
      <app-cube-field></app-cube-field>
    </div>
  `,
  styles: [`
    .home-page-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
  `]
})
export class HomeComponent {}
