import { Component, ViewChild,Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team-leader-projects',
  templateUrl: './team-leader-projects.component.html',
  styleUrl: './team-leader-projects.component.css'
})
export class TeamLeaderProjectsComponent implements OnInit {
 
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
  GraphicEmp:any;
  bundleEmp:any;
  sales:any;
  transferName: any;
  salesPerson_name: any;
  salesEmp:any;
  empData:any;
  empDataPre:any;
  empDataTwoPre:any;

  updateEditorVisible: boolean = true;
  selectedRowIndex: number = -1;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  salesForm = new FormGroup({
    salesperson_name: new FormControl("null")
  });
  rangeData: any;
 
  ngOnInit(): void {
    this.salesForm.get('salesperson_name')?.valueChanges.subscribe(value=>{
      this.salesPerson_name = this.salesForm.get('salesperson_name')?.value;
      this.getData();
    });
  }

  constructor(private auth: AuthService, private formBuilder: FormBuilder,private renderer: Renderer2,private toastr: ToastrService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      this.transferName = this.tok.signupUsername;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
 
    this.auth.allProjects().subscribe((list : any)=>{
      this.data = list;
    });
    this.auth.allPreviousProjects().subscribe((list : any)=>{
      this.dataPreviousMonth = list;
    });
    this.auth.allTwoPreviousProjects().subscribe((list : any)=>{
      this.dataTwoPreviousMonth = list;
    });
    this.auth.allEmployee().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.salesEmp = res.filter((empS: any) => empS.signupRole && empS.signupRole.includes('Sales Team'));
      } else {
        console.error("Unexpected response format:", res);
      }
    });
    
    this.auth.getSalesTeam().subscribe((res:any)=>{
      this.sales = res;
    });
    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();
  }

  getData(){
    this.auth.empAllProjects(this.salesPerson_name).subscribe((list : any)=>{
      this.empData = list;
    });
    this.auth.empAllPrevMonth(this.salesPerson_name).subscribe((list: any)=>{
      this.empDataPre = list;
    });
    this.auth.empAllPrevTwoMonth(this.salesPerson_name).subscribe((list:any)=>{
      this.empDataTwoPre = list;
    })
  }

  ToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
  }

  searchCustomer(){
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobile(mobile).subscribe((customers)=>{
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }
  downloadFile(){
    this.auth.downloadFile();
  }
  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getDatabyRange(startDate, endDate).subscribe((rangeData:any)=>{
        this.rangeData = rangeData.rangeTotalData;
      })
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

  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteCust(id).subscribe((res : any)=>{
        this.data.splice(i,1);
      })
    }
  }
  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    window.location.href = url;
  }
  invoice(userId: string){
    const url = `/salesHome/main-invoice/${userId}`;
    window.open(url,'_blank');
  }

  highlightRow(index: number) {
    this.selectedRowIndex = index;
  }

  updateEditors(user: any) {

    this.auth.updateEditors([user]).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Project Status Changed to ${user.projectStatus}`, 'Success');
      }
    });
  }
}