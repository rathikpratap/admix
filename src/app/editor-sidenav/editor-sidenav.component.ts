import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editor-sidenav',
  templateUrl: './editor-sidenav.component.html',
  styleUrls: ['./editor-sidenav.component.css']
})
export class EditorSidenavComponent {

  @Input() editorSideNavStatus: boolean = false; 
  list = [
    {
      number: '1',
      name: 'Editor Dashboard',
      icon: 'bi bi-house',
      route: '/editor-home/editor-dashboard'
    }
    // },
    // {
    //   number: '2',
    //   name: 'Add New Customer',
    //   icon: 'bi bi-person-fill-add',
    //   route: '/salesHome/newCustomer'
    // },
    // {
    //   number: '3',
    //   name: 'All Customers',
    //   icon: 'bi bi-person-square',
    //   route: '/salesHome/allCustomers'
    // },
    // {
    //   number: '4',
    //   name: 'Leads',
    //   icon: 'bi bi-arrow-down-circle',
    //   route: '/salesHome/sales-leads'
    // }
  ]
}
