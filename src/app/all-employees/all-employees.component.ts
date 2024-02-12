import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css']
})
export class AllEmployeesComponent {
 
  data: any=[];

  constructor(private auth: AuthService){
    this.auth.allEmployee().subscribe((list : any)=>{
      console.log("list", list)
      this.data = list;
    })
  }
}
