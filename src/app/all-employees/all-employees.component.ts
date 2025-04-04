import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css']
})
export class AllEmployeesComponent {
 
  data: any=[];
  tok:any;

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.auth.allEmployee().subscribe((list : any)=>{
      this.data = list;
    }) 
  }

  delete(id:any, i:any){
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteEmp(id).subscribe((res : any)=>{
        this.data.splice(i,1);
      })
    }
  }

}
