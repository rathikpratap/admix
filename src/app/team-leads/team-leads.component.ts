import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team-leads',
  templateUrl: './team-leads.component.html',
  styleUrls: ['./team-leads.component.css']
})
export class TeamLeadsComponent implements OnInit {
 
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
  projects: any[] = [];
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
  modifyCount:any;
  secondFbLeads:any;
  transferName: any;
  campaign_names: any;
  campaignName: any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_name: new FormControl("null")
  });

  updateButtonVisible: boolean = true;

  ngOnInit(): void {
    this.categForm.get('campaign_name')?.valueChanges.subscribe(value=>{
      this.campaignName = this.categForm.get('campaign_name')?.value;
      console.log("NAME NAME NAME=====>", this.campaignName);
      this.getgetData();
    });
  }

  constructor(private auth: AuthService,private formBuilder: FormBuilder,private renderer: Renderer2, private toastr: ToastrService){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data.salesTeam;
      console.log("USerDAta==>", this.tok)
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    })

    this.searchForm = this.formBuilder.group({
      projectStatus: [''],
      mobile: ['']
    });
    this.auth.salesFacebookLeads().subscribe((res:any)=>{
      console.log("Fetched Facebook Leads===>>", res);
      this.fbLeads = res;
    });
    this.auth.salesSecondFacebookLeads().subscribe((res:any)=>{
      this.secondFbLeads = res;
      console.log("SEcond Leadas=====>>", this.secondFbLeads);
    });
    this.auth.getCampaign().subscribe((res:any)=>{
      console.log("CAMPAIGN_NAME=========>>", res);
      this.campaign_names = res.filter((campaign: any, index: number, self:any[])=>
      index === self.findIndex((c:any)=> c.campaign_Name === campaign.campaign_Name));
      console.log("campaign_names=========>>", this.campaign_names);
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

  getgetData(){
    this.auth.getTeamLeads(this.campaignName).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.data = res; 
    });  

    this.auth.getYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataYesterday = res;
    });
 
    this.auth.getOneYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataOneYesterday = res;
    });

    this.auth.getTwoYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataTwoYesterday = res;
    });

    this.auth.getThreeYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataThreeYesterday = res;
    });

    this.auth.getFourYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFourYesterday = res;
    });

    this.auth.getFiveYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.dataFiveYesterday = res;
    });
  }

  refreshPage(){
    window.location.reload();
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;
    const categ = this.categForm.value.campaign_name;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate && categ){
      this.auth.getSalesLeadbyRange(startDate, endDate, categ).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }

  searchCustomer(){
    const projectStatus = this.searchForm.get('projectStatus')!.value;
    this.auth.searchCustomerbyProject(projectStatus).subscribe((customers)=>{
      console.log("customer",customers)
      this.projects = customers;
      this.errorMessage = null; 
    },
    error=>{
      this.projects = [];
      this.errorMessage = error.message;
    });
  }
  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
  invoice(userId: string){
    const url = `/salesHome/est-invoice/${userId}`;
    window.open(url,'_blank');
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
    window.location.href = url;
    //window.open(url, '_blank');
  }
  updateLeads(){
    this.auth.updateLead().subscribe((res:any)=>{
      this.modifyCount = res;
    });
  }
  whatsAppLeads(){
    const url = `/salesHome/whatsApp-leads`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteSalesLead(id).subscribe((res : any)=>{
        this.data.splice(i,1);
        alert("Data Delete Successfully");
        window.location.reload();
      })
    }
  }
  transferLead(user:any,newSalesTeam:any){
    const currentDate = new Date().toISOString();
    const transferData = {
      custId: user._id,              // Updated key name to match backend
      salesTeam: newSalesTeam,       // Updated key name to match backend
      closingDate: currentDate,       // Pass the current date as closing date
      name: this.transferName
    };
    console.log("TransferData====>", transferData);
    this.auth.transferToLeads(transferData).subscribe((res:any)=>{
      this.toastr.success("Transferred Successfully","Success");
      console.log("Customer transferred successfully", res);
    })
  }

  searchCustomerByName(){
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobileLeads(mobile).subscribe((customers)=>{
      console.log("customer",customers)
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }
}
