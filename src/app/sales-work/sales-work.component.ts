import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-work',
  templateUrl: './sales-work.component.html',
  styleUrls: ['./sales-work.component.css']
})
export class SalesWorkComponent {

  searchForm: FormGroup; 
  customers :any[] = [];
  errorMessage: any;
  todayDate: string;
  yesterdayDate: string;
  oneYesterdayDate: string; 
  twoYesterdayDate: string;
  threeYesterdayDate: string;
  fourYesterdayDate: string;
  fiveYesterdayDate: string;
  data:any; 
  dataYesterday: any;
  dataOneYesterday: any;
  dataTwoYesterday: any;
  dataThreeYesterday: any;
  dataFourYesterday: any;
  dataFiveYesterday: any;
  tok:any;
  isExpanded: boolean = false;
  rangeData: any;
  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });

  constructor(private auth: AuthService, private formBuilder: FormBuilder,private renderer: Renderer2){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.searchForm = this.formBuilder.group({
      projectStatus: ['']
    });

    this.auth.getSalesTeamWork().subscribe((res:any)=>{
      this.data = res;
    });

    this.auth.getSalesYesterdayTeamWork().subscribe((res:any)=>{
      this.dataYesterday = res;
    });
 
    this.auth.getSalesOneYesterdayTeamWork().subscribe((res:any)=>{
      this.dataOneYesterday = res;
    });

    this.auth.getSalesTwoYesterdayTeamWork().subscribe((res:any)=>{
      this.dataTwoYesterday = res;
    });

    this.auth.getSalesThreeYesterdayTeamWork().subscribe((res:any)=>{
      this.dataThreeYesterday = res;
    });

    this.auth.getSalesFourYesterdayTeamWork().subscribe((res:any)=>{
      this.dataFourYesterday = res;
    });

    this.auth.getSalesFiveYesterdayTeamWork().subscribe((res:any)=>{
      this.dataFiveYesterday = res;
    });

    this.todayDate = this.auth.getDate();
    this.yesterdayDate = this.auth.getDate(-1);
    this.oneYesterdayDate = this.auth.getDate(-2);
    this.twoYesterdayDate = this.auth.getDate(-3);
    this.threeYesterdayDate = this.auth.getDate(-4);
    this.fourYesterdayDate = this.auth.getDate(-5);
    this.fiveYesterdayDate = this.auth.getDate(-6);
  }
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
  }

  searchCustomer(){
    const projectStatus = this.searchForm.get('projectStatus')!.value;
    this.auth.searchCustomerbyProject(projectStatus).subscribe((customers)=>{
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
      this.auth.getSalesLeadbyRangeAdmin(startDate, endDate).subscribe((rangeData:any)=>{
        this.rangeData = rangeData.rangeTotalData;
      });
    }
  }
  refreshPage(){
    window.location.reload();
  }
  downloadRangeFile(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.downloadSalesRangeFile(startDate, endDate);
    }
  }
  invoice(userId: string){
    const url = `/est-invoice/${userId}`;
    window.open(url,'_blank');
  }
  whatsAppLeads(){
    const url = `/admin-WhatsAppLeads`;
    window.location.href = url;
  }
}
 