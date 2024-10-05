import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-graphic-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './graphic-sidenav.component.html', 
  styleUrl: './graphic-sidenav.component.css'
})
export class GraphicSidenavComponent {
  @Input() graphicSideNavStatus: boolean = false; 
  list = [
    {
      number: '1',
      name: 'Graphic Designer Dashboard',
      icon: 'bi bi-house',
      route: '/graphic-home/graphic-dashboard'
    },
    { 
      number: '2',
      name: 'All Projects',
      icon: 'bi bi-card-list',
      route: '/graphic-home/graphic-projects' 
    },
    {
      number: '3',
      name: 'Payroll',
      icon: 'bi bi-cash',
      route: '/graphic-home/graphic-payroll'
    },
    {
      number: '4',
      name: 'Attendance',
      icon: 'bi bi-postcard',
      route: '/graphic-home/graphic-attendance'
    }
  ]
}
