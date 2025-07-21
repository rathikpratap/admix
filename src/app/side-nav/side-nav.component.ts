import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {

  @Input() sideNavStatus: boolean = false;
  list1 = [
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
      number:'12',
      name: 'Incentive',
      icon: 'bi bi-wallet-fill',
      route: '/incentive'
    }
  ];
  list2 = [
    {
      number: '1',
      name: 'B2b Dashboard',
      icon: 'bi bi-house',
      route: '/b2b-dashboard'
    },
    {
      number: '2',
      name: 'Add New Project',
      icon: 'bi bi-person-fill-add',
      route: '/newB2b-projects'
    },
    {
      number: '3',
      name: 'All B2b Projects',
      icon: 'bi bi-person-square',
      route: '/b2b-projects'
    }
  ];
  list = this.list1;
  constructor(private router: Router){}
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.router.events.subscribe(() =>{
      this.updateList();
    });
    this.updateList();
  }
  private updateList(): void {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/b2b-dashboard') || 
        currentUrl.includes('/newB2b-projects') || 
        currentUrl.includes('/b2b-projects') || 
        currentUrl.startsWith('/update-b2b/')) { // ✅ Correct dynamic route matching
        this.list = this.list2;
    } else {
        this.list = this.list1;
    }
}
}
