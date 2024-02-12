import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sales-side-nav',
  templateUrl: './sales-side-nav.component.html',
  styleUrls: ['./sales-side-nav.component.css']
})
export class SalesSideNavComponent {
 
  @Input() salesSideNavStatus: boolean = false;
  list = [
    {
      number: '1',
      name: 'Sales Dashboard',
      icon: 'bi bi-house',
      route: '/salesHome/salesDashboard'
    },
    {
      number: '2',
      name: 'Add New Customer',
      icon: 'bi bi-person-fill-add',
      route: '/salesHome/newCustomer'
    },
    {
      number: '3',
      name: 'All Customers',
      icon: 'bi bi-person-square',
      route: '/salesHome/allCustomers'
    }
  ]
}
