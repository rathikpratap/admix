import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-script-sidenav',
  templateUrl: './script-sidenav.component.html',
  styleUrls: ['./script-sidenav.component.css']
})
export class ScriptSidenavComponent {

  @Input() scriptSideNavStatus: boolean = false; 
  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'bi bi-house',
      route: '/script-home/script-dashboard'
    },
    {
      number: '2',
      name: 'All Projects',
      icon: 'bi bi-card-list',
      route: '/script-home/script-projects'
    }
  ]
}
