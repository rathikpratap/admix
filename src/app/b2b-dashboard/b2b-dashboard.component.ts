import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-b2b-dashboard',
  templateUrl: './b2b-dashboard.component.html',
  styleUrls: ['./b2b-dashboard.component.css']
})
export class B2bDashboardComponent {
  tok:any;
  totalEntries: any;
  data:any;
  dataLength:any;
  allTotalEntries:any;
  completeProjects:any;
  allActive:any;
  allComplete:any;
  allTotalAmount:any;
  MonthlyAmount:any;
  completeData:any;

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.getMonthEntriesB2b().subscribe((res:any)=>{
      this.totalEntries = res.totalEntries.length;
      this.MonthlyAmount = res.totalAmount;
    },(error)=>{
      console.error('Error Fetching Entries',error);
    });
    this.auth.getCustDataB2b().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
      this.dataLength = list.length;  
    });
    this.auth.getCompleteProjectsB2b().subscribe((res:any)=>{
      this.completeProjects = res.length;
      this.completeData = res;
    });
    this.auth.getAllEntriesB2b().subscribe((res:any)=>{
      this.allTotalEntries = res.totalEntries.length;
      this.allTotalAmount = res.totalAmount;
    });
    this.auth.getAllCustDataB2b().subscribe((res:any)=>{
      this.allActive = res.length;
    });
    this.auth.getAllCompleteProjectsB2b().subscribe((res:any)=>{
      this.allComplete = res.length;
    })
  }
}
