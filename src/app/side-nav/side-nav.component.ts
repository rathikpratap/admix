import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {

  @Input() sideNavStatus: boolean = false;
  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'bi bi-house',
      route: '/admin-dashboard'
    },
    {
      number: '2',
      name: 'Add New Employee',
      icon: 'bi bi-person-fill-add',
      route: '/newEmployee'
    },
    {
      number: '3',
      name: 'All Employees',
      icon: 'bi bi-person-badge',
      route: '/allEmployees'
    },
    {
      number: '4',
      name: 'Payment',
      icon: 'bi bi-currency-rupee',
      route: '/payment'
    },
    {
      number: '5',
      name: 'All Projects',
      icon: 'bi bi-card-list',
      route: '/all-projects'
    },
    {
      number: '6',
      name: 'Add New Category',
      icon: 'bi bi-file-earmark-plus-fill',
      route: '/new-category'
    },
    {
      number: '7',
      name: 'Get Leads',
      icon: 'bi bi-arrow-down-circle',
      route: '/facebook-leads'
    },
    {
      number: '8',
      name: 'Leads',
      icon: 'bi bi-box-arrow-in-up',
      route: '/Leads'
    },
    {
      number:'9',
      name:'Payroll',
      icon: 'bi bi-cash',
      route:  '/payroll'
    }
  ]
}
