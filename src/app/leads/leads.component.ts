import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent {

  data: any;
  data2: any;
  emp: any;
  rangeData: any;
  tok:any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })

     this.auth.getAdminLeads().subscribe((list : any)=>{
       this.data = list;
     });

    this.auth.getSalesTeam().subscribe((res : any)=>{
      this.emp = res;
    });
  }

  getLeads(){
    this.auth.getAdminLeads().subscribe((list : any)=>{
      this.data = list;
    });
  }
 
  updateSalesperson(){ 
    this.auth.updateSalesperson(this.rangeData).subscribe(( res: any)=>{
      if(this.rangeData){
        alert("Leads Successfully Transfered");
      }
    })
  }

  transferLeads(){
    this.auth.transferLeads().subscribe((res: any)=>{
      console.log("Leads transfered Succefully to admin Leads");
    })
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getLeadbyRange(startDate, endDate).subscribe((rangeData:any)=>{
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }
}
