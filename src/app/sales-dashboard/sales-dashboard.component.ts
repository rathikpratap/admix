import { Component} from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessagingService } from '../service/messaging-service';
import { range } from 'rxjs';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent {

  tok:any;
  data:any; 
  completeData: any;
  totalEntry:any;
  totalEntries: any;
  todayEntry:any;
  todayEntries : any;
  totalAmount:any;
  totalRecv: any;
  totalDue: any;
  rangeData : any;
  dataLength : any;
  allProjects: any;
  allActiveProjects:any;
  accessToken:any;
  dueData:any;
  restData: any;
  topPerformer:any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  }); 


  constructor(private auth: AuthService,private messagingService: MessagingService){

    this.auth.getAccessToken().subscribe((res:any)=>{
      this.accessToken = res;
    });

    this.messagingService.requestPermission();

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
 
    this.auth.getCustData().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
      this.dataLength = list.length;  
    });
    

    this.auth.getCompleteProjects().subscribe((completeList: any)=>{
      console.log("completeList",completeList)
      this.completeData = completeList;
    }); 
 
    this.auth.getMonthEntriesEmp().subscribe((res : any)=>{
      this.totalEntry = res.totalEntries;
      console.log("TOTALENTRY========>>", this.totalEntry);
      this.totalEntries = res.totalEntries.length;
      this.totalAmount = res.totalAmount;
      this.totalRecv = res.totalRecv;
      this.totalDue = res.totalDue;
    },(error)=>{
      console.error('Error fetching total Entries', error);
    }); 
    this.auth.getDueAmount().subscribe((res:any)=>{
      this.dueData = res;
      console.log("DUEDATA==========>>", this.dueData);
    });
    this.auth.getRestAmount().subscribe((res:any)=>{
      this.restData = res;
      console.log("DUEDATA==========>>", this.restData);
    });
    this.auth.topPerformer().subscribe((res:any)=>{
      this.topPerformer = res;
      console.log("TOP=====>>", this.topPerformer);
    });

    this.auth.getTodayEntriesEmp().subscribe((todayRes:any)=>{
      console.log('Response Data:', todayRes);
      const totalDayEntry = todayRes.totalDayEntry;
      if(Array.isArray(totalDayEntry)){
        this.todayEntry = totalDayEntry;
        this.todayEntries = totalDayEntry.length;
      }else{
        this.todayEntries = 0;
      }
      
    },(error)=>{
      console.error('Error Fetching today Entreis', error);
    });
    this.auth.allProjectsSales().subscribe((res:any)=>{
      this.allActiveProjects = res;
      this.allProjects = res.length;
    })
  }
  
  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getDatabyRange(startDate, endDate).subscribe((rangedata:any)=>{
        console.log("Data by Date Range==>", rangedata);
        this.rangeData = rangedata;
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
  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    window.open(url, '_blank');
  }
}

