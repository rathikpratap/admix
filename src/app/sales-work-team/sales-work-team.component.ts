import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-work-team',
  templateUrl: './sales-work-team.component.html',
  styleUrl: './sales-work-team.component.css'
})
export class SalesWorkTeamComponent implements OnInit{

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
  salesEmp:any;
  salesPerson_name:any;
  empData:any; 
  empDataYesterday: any;
  empDataOneYesterday: any;
  empDataTwoYesterday: any;
  empDataThreeYesterday: any;
  empDataFourYesterday: any;
  empDataFiveYesterday: any;
  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  salesForm = new FormGroup({
    salesperson_name: new FormControl("null")
  });

  ngOnInit(): void {
    this.salesForm.get('salesperson_name')?.valueChanges.subscribe(value=>{
      this.salesPerson_name = this.salesForm.get('salesperson_name')?.value;
      console.log("SalesPerson NAme=====>>", this.salesPerson_name);
      this.getSalesData();
    });
  }

  getSalesData(){
    this.auth.getEmpSalesTeamWork(this.salesPerson_name).subscribe((res:any)=>{
      this.empData = res;
    });
    this.auth.getEmpSalesYesterdayTeamWork(this.salesPerson_name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.empDataYesterday = res;
    });
 
    this.auth.getEmpSalesOneYesterdayTeamWork(this.salesPerson_name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.empDataOneYesterday = res;
    });

    this.auth.getEmpSalesTwoYesterdayTeamWork(this.salesPerson_name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.empDataTwoYesterday = res;
    });

    this.auth.getEmpSalesThreeYesterdayTeamWork(this.salesPerson_name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.empDataThreeYesterday = res;
    });

    this.auth.getEmpSalesFourYesterdayTeamWork(this.salesPerson_name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.empDataFourYesterday = res;
    });

    this.auth.getEmpSalesFiveYesterdayTeamWork(this.salesPerson_name).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.empDataFiveYesterday = res;
    });
  }

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
      console.log("SalesLeads===>", res);
      this.data = res;
    });

    this.auth.getSalesYesterdayTeamWork().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataYesterday = res;
    });
 
    this.auth.getSalesOneYesterdayTeamWork().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataOneYesterday = res;
    });

    this.auth.getSalesTwoYesterdayTeamWork().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataTwoYesterday = res;
    });

    this.auth.getSalesThreeYesterdayTeamWork().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataThreeYesterday = res;
    });

    this.auth.getSalesFourYesterdayTeamWork().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFourYesterday = res;
    });

    this.auth.getSalesFiveYesterdayTeamWork().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFiveYesterday = res;
    });
    this.auth.allEmployee().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.salesEmp = res.filter((empS: any) => empS.signupRole && empS.signupRole.includes('Sales Team'));
      } else {
        console.error("Unexpected response format:", res);
      }
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
}
