import { Component, Renderer2, OnInit  } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-whats-app-leads',
  templateUrl: './admin-whats-app-leads.component.html',
  styleUrls: ['./admin-whats-app-leads.component.css']
})
export class AdminWhatsAppLeadsComponent implements OnInit {
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
  categForm = new FormGroup({
    campaign_Name: new FormControl("null")
  });
  Category:any;
  campaign_Name: any;

  ngOnInit(): void {
    this.categForm.get('campaign_Name')?.valueChanges.subscribe(value=>{
      this.campaign_Name = this.categForm.get('campaign_Name')?.value;
      console.log("Campaign Name===>", this.campaign_Name);
      this.getgetData();
    });    
  }

  constructor(private auth: AuthService, private formBuilder: FormBuilder,private renderer: Renderer2){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.getWhatsAppCategory().subscribe((category:any)=>{
      console.log("Categories===>>", category);
      this.Category = category;
    });

    this.searchForm = this.formBuilder.group({
      projectStatus: ['']
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
      console.log("customer",customers)
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }

  getgetData(){

    this.auth.getSalesWhatsAppWork(this.campaign_Name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.data = res;
    });

    this.auth.getSalesYesterdayWhatsAppWork(this.campaign_Name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataYesterday = res;
    });
 
    this.auth.getSalesOneYesterdayWhatsAppWork(this.campaign_Name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataOneYesterday = res;
    });

    this.auth.getSalesTwoYesterdayWhatsAppWork(this.campaign_Name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataTwoYesterday = res;
    });

    this.auth.getSalesThreeYesterdayWhatsAppWork(this.campaign_Name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataThreeYesterday = res;
    });

    this.auth.getSalesFourYesterdayWhatsAppWork(this.campaign_Name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFourYesterday = res;
    });

    this.auth.getSalesFiveYesterdayWhatsAppWork(this.campaign_Name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFiveYesterday = res;
    });
  }
  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getSalesLeadbyRangeAdmin(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
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
    //window.open(url, '_blank');
    window.location.href = url;
  }
}
