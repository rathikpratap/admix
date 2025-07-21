import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editor-projects',
  templateUrl: './editor-projects.component.html',
  styleUrls: ['./editor-projects.component.css']
})
export class EditorProjectsComponent {
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
  emp:any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.editorProjects().subscribe((res:any)=>{
      console.log("SUBENTRIES========>>", res.list);
      this.data = res.list;
    });
    this.auth.editorPreviousProjects().subscribe((res:any)=>{
      this.previousData = res.list;
    });
    this.auth.editorTwoPreviousProjects().subscribe((res:any)=>{
      this.twoPreviousData = res.list;
    });
    this.auth.allEditorProjects().subscribe((res:any)=>{
      this.allData = res.list;
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
      this.auth.getDatabyDatePassRangeEditor(startDate, endDate).subscribe((rangeData:any)=>{
        this.rangeData = rangeData;
      });
    }
  } 
  otherProjects(){
    const url = `/editor-home/editor-otherProjects`;
    window.location.href = url;
  }
  openUpdatePanel(userId: string, type: string) {
    if(type === 'Customer'){
      const url = `/editor-home/editor-update/${userId}`;
      window.location.href = url;
    }else if(type === 'b2b'){
      const url = `/editor-home/editor-b2b-update/${userId}`;
      window.location.href = url;
    }
  }
} 
