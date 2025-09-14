import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-deletion',
  standalone: true,
  imports: [],
  templateUrl: './data-deletion.component.html',
  styleUrl: './data-deletion.component.css'
})
export class DataDeletionComponent { 

  constructor(private router: Router){}

  login(){
    this.router.navigate(['/login']);
  }

}
