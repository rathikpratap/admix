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

  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteEmp(id).subscribe((res : any)=>{
        this.data.splice(i,1);
      })
    }
  }

}
