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
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `]
})
export class HomeComponent {}
