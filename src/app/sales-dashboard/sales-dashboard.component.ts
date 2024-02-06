import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent {

  
  data:any=[];
  completeData: any=[];

  constructor(private auth: AuthService){
    this.auth.getCustData().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
    })

    this.auth.getCompleteProjects().subscribe((completeList: any)=>{
      console.log("completeList",completeList)
      this.completeData = completeList;
    })
  }
  
}
