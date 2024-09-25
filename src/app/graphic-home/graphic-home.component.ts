import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GraphicNavbarComponent } from "../graphic-navbar/graphic-navbar.component";
import { RouterModule } from '@angular/router';
import { GraphicSidenavComponent } from '../graphic-sidenav/graphic-sidenav.component';


@Component({
    selector: 'app-graphic-home',
    standalone: true,
    templateUrl: './graphic-home.component.html',
    styleUrl: './graphic-home.component.css',
    imports: [CommonModule, GraphicNavbarComponent, RouterModule, GraphicSidenavComponent]
})
export class GraphicHomeComponent {
  graphicSideNavStatus: boolean = false;
}
