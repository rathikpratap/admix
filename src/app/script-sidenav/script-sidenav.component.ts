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
      name: 'Writer Dashboard',
      icon: 'bi bi-house',
      route: '/script-home/script-dashboard'
    }
  ]
}
