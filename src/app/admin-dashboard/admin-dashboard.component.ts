import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
 

  data:any;
  allData:any;
  totalEntries: any;
  todayEntries : any;
  rangeData : any;
  totalAmount:any;
  totalRecv: any;
  totalDue: any;
  dataLength: any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });

  constructor(private auth: AuthService) {
    this.auth.getAllProjects().subscribe((allList : any)=>{
      console.log("allList",allList)
      this.data = allList;
      this.dataLength = allList.length;
      console.log('loag ==>', this.data);
      
    })

    this.auth.getAllCompleteProjects().subscribe((allProject : any)=>{
      console.log("allProject",allProject)
      this.allData = allProject;
    })
    this.auth.getMonthEntries().subscribe((res : any)=>{
      this.totalEntries = res.totalEntries.length;
      this.totalAmount = res.totalAmount;
      this.totalRecv = res.totalRecv;
      this.totalDue = res.totalDue;
    },(error)=>{
      console.error('Error fetching total Entries', error);
    });

    this.auth.getTodayEntries().subscribe((todayRes:any)=>{
      console.log('Response Data:', todayRes);
      const totalDayEntry = todayRes.totalDayEntry;
      if(Array.isArray(totalDayEntry)){
        this.todayEntries = totalDayEntry.length;
      }else{
        this.todayEntries = 0;
      }
      
    },(error)=>{
      console.error('Error Fetching today Entreis', error);
    });

  }

  onSubmit(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getDatabyRange(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range==>", rangeData);
        this.rangeData = rangeData;
      },(error)=>{
        console.error('Error fetching data', error);
      });
    }else{
      console.error("Start date and End Date is not Valid");
    }
    
  }

  downloadRangeFile(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.downloadRangeFile(startDate, endDate);
    }
  }

  downloadDueFile(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.downloadDueFile(startDate, endDate);
    }
  }

  resetData(){
    location.reload(); 
  }
}
