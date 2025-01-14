import { Component, Input } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-side-nav',
  templateUrl: './sales-side-nav.component.html',
  styleUrls: ['./sales-side-nav.component.css']
})
export class SalesSideNavComponent {

  tok: any;
  currentTeam: any;
  @Input() salesSideNavStatus: boolean = false;
  list1 = [
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
    },
    {
      number: '4',
      name: 'Team Closing',
      icon: 'bi bi-arrow-down-circle',
      route: '/salesHome/sales-leads'
    },
    {
      number: '5',
      name: 'Team Leads',
      icon: 'bi bi-chat-square-text',
      route: '/salesHome/team-leads'
    },
    {
      number: '6',
      name: 'Custom Leads',
      icon: 'bi bi-whatsapp',
      route: '/salesHome/whatsApp-leads'
    },
    {
      number: '7',
      name: 'Add new Task',
      icon: 'bi bi-plus-circle-fill',
      route: '/salesHome/sales-new-task'
    },
    {
      number: '8',
      name: 'Attendance', 
      icon:'bi bi-postcard',
      route: '/salesHome/attendance'
    },
    {
      number: '9',
      name: 'Incentive',
      icon: 'bi bi-currency-rupee',
      route: '/salesHome/sales-incentive'
    }
  ];
  list2 = [
    {
      number: '1',
      name: 'Sales Dashboard',
      icon: 'bi bi-house',
      route: '/salesHome/b2b-dashboard'
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
      route: '/salesHome/b2b-projects'
    }
  ];
  list = this.list1;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      this.currentTeam = this.tok.salesTeam;
      this.updateListBasedOnTeam();
    });
  }
  private updateListBasedOnTeam(): void {
    if (this.currentTeam === 'Shiva Development') {
      this.list = this.list2;
    } else {
      this.list = this.list1;
    }
  }
}
