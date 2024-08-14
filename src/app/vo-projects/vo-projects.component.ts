import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vo-projects',
  templateUrl: './vo-projects.component.html',
  styleUrls: ['./vo-projects.component.css']
})
export class VoProjectsComponent { 

  data: any;
  tok:any;
  searchForm: FormGroup;
  customers :any[] = [];
  errorMessage: any;
  previousMonthName: string;
  previousTwoMonthName: string;
  currentMonthName: string;
  allData:any;
  previousData: any;
  twoPreviousData: any;
  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;
  constructor(private auth: AuthService, private formBuilder: FormBuilder){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.voProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    });
    this.auth.voPreviousProjects().subscribe((res:any)=>{
      this.previousData = res;
    });
    this.auth.voTwoPreviousProjects().subscribe((res:any)=>{
      this.twoPreviousData = res;
    });
    this.auth.allVoProjects().subscribe((res:any)=>{
      this.allData = res;
    });
    this.searchForm = this.formBuilder.group({
      projectName: ['']
    });
    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();
  }
  searchCustomer(){
    const projectName = this.searchForm.get('projectName')!.value;
    console.log("NUMBER===>", projectName);
    this.auth.searchCustomerbyProjectName(projectName).subscribe((customers: any)=>{
      console.log("customer",customers)
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }
  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getDatabyDatePassRangeVo(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData);
        this.rangeData = rangeData;
      })
    }
  }
  openUpdatePanel(userId: string) {
    const url = `/vo-home/vo-update/${userId}`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
}
 