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
      name: 'Add New Tasks',
      icon: 'bi bi-plus-circle-fill',
      route: '/new-task'
    },
    {
      number: '5',
      name: 'Payment',
      icon: 'bi bi-currency-rupee',
      route: '/payment'
    },
    {
      number: '6',
      name: 'All Projects',
      icon: 'bi bi-card-list',
      route: '/all-projects'
    },
    {
      number: '7',
      name: 'Add New Category',
      icon: 'bi bi-file-earmark-plus-fill',
      route: '/new-category'
    },
    {
      number: '8',
      name: 'Get Leads',
      icon: 'bi bi-arrow-down-circle',
      route: '/facebook-leads'
    },
    {
      number: '9',
      name: 'Leads',
      icon: 'bi bi-box-arrow-in-up',
      route: '/Leads'
    },
    {
      number:'10',
      name:'Payroll',
      icon: 'bi bi-cash',
      route: '/payroll'
    },
    // {
    //   number:'10',
    //   name:'Attendance',
    //   icon:'bi bi-postcard',
    //   route:'/admin-attendance'
    // },
    {
      number:'11',
      name:'Attendance',
      icon:'bi bi-postcard',
      route:'/manual-attendance'
    },
    {
      number: '12',
      name: 'Download Invoice',
      icon: 'bi bi-receipt-cutoff',
      route: '/download_invoice'
    },
    {
      number:'13',
      name: 'Incentive',
      icon: 'bi bi-wallet-fill',
      route: '/incentive'
    }
  ]
}
