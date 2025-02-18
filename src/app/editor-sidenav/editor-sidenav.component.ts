import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor-sidenav',
  templateUrl: './editor-sidenav.component.html',
  styleUrls: ['./editor-sidenav.component.css']
})
export class EditorSidenavComponent {

  @Input() editorSideNavStatus: boolean = false; 
  list1 = [
    {
      number: '1',
      name: 'Editor Dashboard',
      icon: 'bi bi-house',
      route: '/editor-home/editor-dashboard'
    },
    { 
      number: '2',
      name: 'All Projects',
      icon: 'bi bi-card-list',
      route: '/editor-home/editor-projects' 
    },
    {
      number: '3',
      name: 'Payroll',
      icon: 'bi bi-cash',
      route: '/editor-home/editor-payroll'
    },
    {
      number: '4',
      name: 'Attendance',
      icon: 'bi bi-postcard',
      route: '/editor-home/editor-attendance'
    }
  ];
  list2 = [
    {
      number: '4',
      name: 'Company Dashboard',
      icon: 'bi bi-house',
      route: '/editor-home/editor-other'
    },
    {
      number: '5',
      name: 'Other Company Projects ',
      icon: 'bi bi-card-list',
      route: '/editor-home/editor-otherProjects'
    }
  ];
  list3 = [
    {
      number: '1',
      name: 'Bundle Dashboard',
      icon: 'bi bi-house',
      route: '/editor-home/bundle-dashboard'
    },
    {
      number: '2',
      name: 'All Bundles',
      icon: 'bi bi-card-list',
      route: '/editor-home/bundle-projects'
    }
  ];
  list = this.list1;

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.updateListBasedOnRoute();
    });
    this.updateListBasedOnRoute(); // Initial check
  }

  private updateListBasedOnRoute(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/editor-home/editor-otherProjects' || currentUrl === '/editor-home/editor-other') {
      this.list = this.list2;
    }else if( currentUrl === '/editor-home/bundle-dashboard' || currentUrl === '/editor-home/bundle-projects'){
      this.list = this.list3;
    } else {
      this.list = this.list1;
    }
  }
} 
 