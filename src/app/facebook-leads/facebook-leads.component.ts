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
  tok: any;

  statusList: string[] = [
    "Exclude Closing", "Closing", "Demo Sent", "Contacted",
    "Not Interested", "Not Pick", "Busy", "Interested"
  ];

  selectedStatus: string[] = [];

  // filters display ke liye
  lastStartDate!: Date | null;
  lastEndDate!: Date | null;

  dateRangeForm = new FormGroup({
    status: new FormControl<string[]>([] as string[]),
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });


  constructor(private auth: AuthService) {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    })
    // this.auth.fetchLeads().subscribe((res :any)=>{
    //   this.data2 = res;
    // });

    // this.auth.getLeads().subscribe((list : any)=>{
    //   this.data = list;
    // }); 

    this.auth.allEmployee().subscribe((res: any) => {
      this.emp = res;
    });
  }

  onStatusCheckboxChange(event: any, status: string) {
    if (event.target.checked) {
      if (!this.selectedStatus.includes(status)) {
        this.selectedStatus.push(status);
      }
    } else {
      this.selectedStatus = this.selectedStatus.filter(s => s !== status);
    }

    // form ke andar bhi status update kar do
    this.dateRangeForm.patchValue({
      status: this.selectedStatus
    });
  }

  getLeads() {
    this.auth.getLeads().subscribe((list: any) => {
      this.data = list;
    });
  }

  transferLeads() {
    this.auth.transferLeads().subscribe((res: any) => {
      alert("Leads Successfully Transfered");
      console.log("Leads transfered Succefully to admin Leads");
    });
  }

  // onDate(){
  //   const startDateValue = this.dateRangeForm.value.startDate;
  //   const endDateValue = this.dateRangeForm.value.endDate;

  //   const startDate = startDateValue? new Date(startDateValue) : null;
  //   const endDate = endDateValue? new Date(endDateValue) : null;

  //   if(startDate && endDate){
  //     this.auth.getLeadbyRange(startDate, endDate).subscribe((rangeData:any)=>{
  //       console.log("Data by Date Range===>>", rangeData.rangeTotalData);
  //       this.rangeData = rangeData.rangeTotalData;
  //     })
  //   }
  // }

  onDate() {
    const formValue = this.dateRangeForm.value;

    const startDateValue = formValue.startDate;
    const endDateValue = formValue.endDate;
    const statusValue = formValue.status || [];

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {

      // filters ko store karo taaki UI me dikha sako
      this.lastStartDate = startDate;
      this.lastEndDate = endDate;
      this.selectedStatus = statusValue;

      console.log(`(${this.selectedStatus}, ${this.lastStartDate}, ${this.lastEndDate})`);

      this.auth.getLeadbyRangeEx(startDate, endDate, statusValue).subscribe((rangeData: any) => {
        console.log("Data by Date Range & Status===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      });
    }
  }

  downloadRangeFile() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;
    const statusValue = this.dateRangeForm.value.status || [];

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {

      this.lastStartDate = startDate;
      this.lastEndDate = endDate;
      this.selectedStatus = statusValue;

      console.log(`(${this.selectedStatus}, ${this.lastStartDate}, ${this.lastEndDate})`);

      this.auth.downloadRangeFileEx(startDate, endDate, statusValue);
    }
  }
}
