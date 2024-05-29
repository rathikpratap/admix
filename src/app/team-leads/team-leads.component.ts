import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-team-leads',
  templateUrl: './team-leads.component.html',
  styleUrls: ['./team-leads.component.css']
})
export class TeamLeadsComponent {
 
  data:any; 
  dataYesterday: any;
  dataOneYesterday: any;
  dataTwoYesterday: any;
  dataThreeYesterday: any;
  dataFourYesterday: any;
  dataFiveYesterday: any;
  dataLength:any;
  rangeData: any;
  searchForm: FormGroup;
  customers :any[] = [];
  errorMessage: any;
  tok: any;
  Category: any;
  emp: any;
  todayDate: string;
  yesterdayDate: string;
  oneYesterdayDate: string;
  twoYesterdayDate: string;
  threeYesterdayDate: string;
  fourYesterdayDate: string;
  fiveYesterdayDate: string;
  fbLeads: any;
  modifyCount:any

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });

  updateButtonVisible: boolean = true;

  constructor(private auth: AuthService,private formBuilder: FormBuilder,private renderer: Renderer2){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data.salesTeam;
      console.log("USerDAta==>", this.tok)
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    })

    this.searchForm = this.formBuilder.group({
      projectStatus: ['']
    });
    this.auth.salesFacebookLeads().subscribe((res:any)=>{
      console.log("Fetched Facebook Leads===>>", res);
      this.fbLeads = res;
    })
    this.auth.getTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.data = res;
    }); 

    this.auth.getYesterdayTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataYesterday = res;
    });
 
    this.auth.getOneYesterdayTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataOneYesterday = res;
    });

    this.auth.getTwoYesterdayTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataTwoYesterday = res;
    });

    this.auth.getThreeYesterdayTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataThreeYesterday = res;
    });

    this.auth.getFourYesterdayTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFourYesterday = res;
    });

    this.auth.getFiveYesterdayTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFiveYesterday = res;
    });

    this.todayDate = this.auth.getDate();
    this.yesterdayDate = this.auth.getDate(-1);
    this.oneYesterdayDate = this.auth.getDate(-2);
    this.twoYesterdayDate = this.auth.getDate(-3);
    this.threeYesterdayDate = this.auth.getDate(-4);
    this.fourYesterdayDate = this.auth.getDate(-5);
    this.fiveYesterdayDate = this.auth.getDate(-6);

    this.auth.dataLength().subscribe((res:any)=>{
      console.log("length==>", res);
      this.dataLength = res;
    });

    this.auth.getCategory().subscribe((category:any)=>{
      console.log("Categories===>>", category);
      this.Category = category;
    });

    this.auth.getSalesTeam().subscribe((res : any)=>{
      console.log("Sales Teams==>", res);
      this.emp = res;
    }) 
  }

  refreshPage(){
    window.location.reload();
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getSalesLeadbyRange(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
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
  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    window.open(url, '_blank');
  }

  updateProjectStatus(dataa: any){ 
    this.auth.updateProjectStatus(dataa).subscribe(( res: any)=>{
      if(dataa){
        alert("Data Project Status Successfully Transfered");
        console.log("Project Status Updated Data", dataa);
      }
      
      console.log("SalesPerson Updated Successfully", res);
    })
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
  customLeads(){
    const url = `/salesHome/custom-leads`;
    window.open(url, '_blank');
  }
  updateLeads(){
    this.auth.updateLead().subscribe((res:any)=>{
      this.modifyCount = res;
    });
  }
}
