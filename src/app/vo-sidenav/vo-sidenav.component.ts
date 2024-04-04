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
      name: 'Artist Dashboard',
      icon: 'bi bi-house',
      route: '/vo-home/vo-dashboard'
    }
  ]
}
