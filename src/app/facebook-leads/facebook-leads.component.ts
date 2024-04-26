import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-facebook-leads',
  templateUrl: './facebook-leads.component.html',
  styleUrls: ['./facebook-leads.component.css']
})
export class FacebookLeadsComponent {
 
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
    this.auth.fetchLeads().subscribe((res :any)=>{
      this.data2 = res;
    });

    this.auth.getLeads().subscribe((list : any)=>{
      console.log("list==>",list)
      this.data = list;
    }); 

    this.auth.allEmployee().subscribe((res : any)=>{
      console.log("employee==>", res);
      this.emp = res;
    })
  }
 
  getLeads(){
    this.auth.getLeads().subscribe((list : any)=>{
      console.log("list==>",list)
      this.data = list;
      console.log(list.campaign_name)
    })
  }

  transferLeads(){
    this.auth.transferLeads().subscribe((res: any)=>{
      alert("Leads Successfully Transfered");
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
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }
}
