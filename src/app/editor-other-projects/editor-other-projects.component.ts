import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor-other-projects',
  templateUrl: './editor-other-projects.component.html',
  styleUrls: ['./editor-other-projects.component.css']
})
export class EditorOtherProjectsComponent {
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
    this.auth.editorOtherProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    });
    this.auth.editorPreviousOtherProjects().subscribe((res:any)=>{
      this.previousData = res;
    });
    this.auth.editorTwoPreviousOtherProjects().subscribe((res:any)=>{
      this.twoPreviousData = res;
    });
    this.auth.allEditorOtherProjects().subscribe((res:any)=>{
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
    this.auth.searchB2bByProjectName(projectName).subscribe((customers: any)=>{
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
      this.auth.getDatabyDatePassRangeEditorOther(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData);
        this.rangeData = rangeData;
      })
    }
  }
  otherProjects(){
    const url = `/editor-home/editor-projects`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
  openUpdatePanel(userId: string) {
    const url = `/editor-home/editor-b2b-update/${userId}`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
}
