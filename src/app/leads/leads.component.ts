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

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  

  constructor(private auth: AuthService){
    //this.auth.fetchLeads().subscribe((res :any)=>{
    //  this.data2 = res;
    //});

    this.auth.getAdminLeads().subscribe((list : any)=>{
      console.log("list==>",list)
      this.data = list;
    });

    this.auth.allEmployee().subscribe((res : any)=>{
      console.log("employee==>", res);
      this.emp = res;
    })
  }

  getLeads(){
    this.auth.getAdminLeads().subscribe((list : any)=>{
      console.log("list==>",list)
      this.data = list;
      console.log(list.campaign_name)
    })
  }

  updateSalesperson(){

    this.auth.updateSalesperson(this.rangeData).subscribe(( res: any)=>{
      if(this.rangeData){
        alert("Leads Successfully Transfered");
        console.log("SalesPerson Updated Data", this.rangeData);
      }
      
      console.log("SalesPerson Updated Successfully", res);
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
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }
}
