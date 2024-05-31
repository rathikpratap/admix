import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vo-sidenav',
  templateUrl: './vo-sidenav.component.html',
  styleUrls: ['./vo-sidenav.component.css']
})
export class VoSidenavComponent {

  @Input() voSideNavStatus: boolean = false;
  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'bi bi-house',
      route: '/vo-home/vo-dashboard'
    },
    {
      number: '2',
      name: 'All Projects',
      icon: 'bi bi-card-list',
      route: '/vo-home/vo-projects'
    },
    {
      number: '3',
      name: 'Payroll',
      icon: 'bi bi-cash',
      route: '/vo-home/vo-payroll'
    }
  ]
}
