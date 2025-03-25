import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-script-projects',
  templateUrl: './script-projects.component.html',
  styleUrls: ['./script-projects.component.css']
})
export class ScriptProjectsComponent {
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
    this.auth.scriptProjects().subscribe((res:any)=>{
      this.data = res;
    });
    this.auth.scriptPreviousProjects().subscribe((res:any)=>{
      this.previousData = res;
    });
    this.auth.scriptTwoPreviousProjects().subscribe((res:any)=>{
      this.twoPreviousData = res;
    });
    this.auth.allscriptProjects().subscribe((res:any)=>{
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
    this.auth.searchCustomerbyProjectName(projectName).subscribe((customers: any)=>{
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
      this.auth.getDatabyDatePassRange(startDate, endDate).subscribe((rangeData:any)=>{
        this.rangeData = rangeData;
      })
    }
  }
  openUpdatePanel(userId: string) {
    const url = `/script-home/script-update/${userId}`;
    window.location.href = url;
  }
}
