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
    },
    {
      number: '2',
      name: 'All Projects',
      icon: 'bi bi-card-list',
      route: '/editor-home/editor-projects' 
    }
  ]
}
