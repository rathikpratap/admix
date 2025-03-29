import { Component, OnInit } from '@angular/core';
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
  dynamicFields: any;

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
      console.log("CHANGED CAMPAIGN========>>", this.campaignName);
      this.getgetData();
    });
  }

  constructor(private auth: AuthService,private formBuilder: FormBuilder, private toastr: ToastrService){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data.salesTeam;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });

    this.searchForm = this.formBuilder.group({
      projectStatus: [''],
      mobile: ['']
    });
    this.auth.salesFacebookLeads().subscribe((res:any)=>{
      this.fbLeads = res;
    });
    this.auth.salesSecondFacebookLeads().subscribe((res:any)=>{
      this.secondFbLeads = res;
    });
    this.auth.getCampaign().subscribe((res:any)=>{
      this.campaign_names = res.filter((campaign: any, index: number, self:any[])=>
      index === self.findIndex((c:any)=> c.campaign_Name === campaign.campaign_Name));
      console.log("CAMPAIGN NAmes======>>", this.campaign_names);
    });

    // this.auth.getCampaign().subscribe((res: any) => {
    //   this.campaign_names = res;
    //   console.log("Recent Campaign Names: ", this.campaign_names);
    // });
    
    this.todayDate = this.auth.getDate();
    this.yesterdayDate = this.auth.getDate(-1);
    this.oneYesterdayDate = this.auth.getDate(-2);
    this.twoYesterdayDate = this.auth.getDate(-3);
    this.threeYesterdayDate = this.auth.getDate(-4);
    this.fourYesterdayDate = this.auth.getDate(-5);
    this.fiveYesterdayDate = this.auth.getDate(-6);

    this.auth.dataLength().subscribe((res:any)=>{
      this.dataLength = res;
    });

    this.auth.getCategory().subscribe((category:any)=>{
      this.Category = category;
    });

    this.auth.getSalesTeam().subscribe((res : any)=>{
      this.emp = res;
    });
  }

  getgetData(){
    this.auth.getTeamLeads(this.campaignName).subscribe((res:any)=>{
      this.data = res;
      // Extract dynamic fields
    this.dynamicFields = this.getDynamicFields(res);
    console.log("DYNAMIC LEADS===========>>", this.dynamicFields);
    });

    this.auth.getYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      this.dataYesterday = res;
      //this.dynamicFields = this.getDynamicFields(res);
    });
 
    this.auth.getOneYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      this.dataOneYesterday = res;
      //this.dynamicFields = this.getDynamicFields(res);
    });

    this.auth.getTwoYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      this.dataTwoYesterday = res;
      //this.dynamicFields = this.getDynamicFields(res);
    });

    this.auth.getThreeYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      this.dataThreeYesterday = res;
      //this.dynamicFields = this.getDynamicFields(res);
    });

    this.auth.getFourYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      this.dataFourYesterday = res;
      //this.dynamicFields = this.getDynamicFields(res);
    });

    this.auth.getFiveYesterdayTeamLeads(this.campaignName).subscribe((res:any)=>{
      this.dataFiveYesterday = res;
      //this.dynamicFields = this.getDynamicFields(res);
    });
  }
  getDynamicFields(data: any[]): string[] {
    let fields = new Set<string>();
    data.forEach(item => {
        if (item.additionalFields) {
            Object.keys(item.additionalFields).forEach(field => fields.add(field));
        }
    });
    console.log("DYNAMIC FIELDS============>>",fields);
    return Array.from(fields);
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
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }

  searchCustomer(){
    const projectStatus = this.searchForm.get('projectStatus')!.value;
    this.auth.searchCustomerbyProject(projectStatus).subscribe((customers)=>{
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
  }
  invoice(userId: string){
    const url = `/salesHome/est-invoice/${userId}`;
    window.open(url,'_blank');
  }

  updateProjectStatus(dataa: any){ 
    this.auth.updateProjectStatus(dataa).subscribe(( res: any)=>{
      if(dataa){
        alert("Data Project Status Successfully Transfered");
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
  }
  updateLeads(){
    this.auth.updateLead().subscribe((res:any)=>{
      this.modifyCount = res;
    });
  }
  whatsAppLeads(){
    const url = `/salesHome/whatsApp-leads`;
    window.location.href = url;
  }
  delete(id:any, i:any){
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
    this.auth.transferToLeads(transferData).subscribe((res:any)=>{
      this.toastr.success("Transferred Successfully","Success");
    })
  }

  searchCustomerByName(){
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobileLeads(mobile).subscribe((customers)=>{
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }
}