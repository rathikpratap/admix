import { Component, ViewChild,Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-b2b-projects',
  templateUrl: './b2b-projects.component.html',
  styleUrls: ['./b2b-projects.component.css']
})
export class B2bProjectsComponent { 

  @ViewChild('fileInput') fileInput:any;
 selectedFile: File | null =null;
 
  tok:any;
  data:any=[];
  searchForm: FormGroup;
  customers :any[] = [];  
  errorMessage: any;
  previousMonthName: string;
  previousTwoMonthName: string;
  currentMonthName: string;
  dataPreviousMonth: any=[];
  dataTwoPreviousMonth:any=[];
  isExpanded: boolean = false;
  emp:any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder,private renderer: Renderer2,private toastr: ToastrService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
  
    this.auth.getMonthEntriesB2b().subscribe((list : any)=>{
      this.data = list.totalEntries;
    });
    this.auth.getPreviousMonthEntriesB2b().subscribe((list : any)=>{
      this.dataPreviousMonth = list;
    });
    this.auth.getTwoPreviousMonthEntriesB2b().subscribe((list : any)=>{
      this.dataTwoPreviousMonth = list;
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.emp = res;
    });

    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();
  }

  ToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
  }

  filterEmployeeByRole(){
    return this.emp.filter((employee: any)=>
    employee.signupRole && employee.signupRole.includes('Editor'));
  }
  updateb2b(user:any){
    const currentDate = new Date().toISOString().split('T')[0];
    user.b2bEditorPassDate = currentDate;
    let selectedEmployee = this.emp.find((employee: any) => employee.signupUsername === user.b2bEditor);
    

    this.auth.updateB2bEditorname([user]).subscribe((res:any) => {
      if(res){
        this.toastr.success(`Project Successfully Assigned to ${selectedEmployee.signupUsername}`,'Success');
      } else{
        this.toastr.error('Failed to assign Project', 'Error');
      }
    });
  }

  searchCustomer(){
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchB2bByProjectName(mobile).subscribe((customers)=>{
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }

  downloadFile(){
    this.auth.downloadFileB2b();
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getDatabyRangeB2b(startDate, endDate).subscribe((rangeData:any)=>{
        this.rangeData = rangeData;
      })
    }
  }

  downloadRangeFile(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.downloadRangeFileB2b(startDate, endDate);
    }
  }

  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteB2b(id).subscribe((res : any)=>{
        this.data.splice(i,1);
      })
    }
  }
  openUpdatePanel(userId: string) {
    const url = `/update-b2b/${userId}`;
    window.location.href = url;
  }
}
