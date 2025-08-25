import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-whats-app-leads',
  templateUrl: './whats-app-leads.component.html',
  styleUrls: ['./whats-app-leads.component.css']
})
export class WhatsAppLeadsComponent implements OnInit {
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
  projects: any[]=[];
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
  campaign_Name: any;
  transferName: any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_Name: new FormControl("null")
  })

  updateButtonVisible: boolean = true;

  ngOnInit(): void {
    this.categForm.get('campaign_Name')?.valueChanges.subscribe(value=>{
      this.campaign_Name = this.categForm.get('campaign_Name')?.value;
      this.getgetData();
    });    
  } 

  constructor(private auth: AuthService,private formBuilder: FormBuilder, private toastr: ToastrService){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data.salesTeam;
      this.transferName = res?.data.signupUsername;
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
      this.fbLeads = res;
    });
    
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

    this.auth.getWhatsAppCategory().subscribe((category:any)=>{
      this.Category = category;
    });

    this.auth.getSalesTeam().subscribe((res : any)=>{
      this.emp = res;
    });  
  }
  getgetData(){
    this.auth.getWhatsAppLeads(this.campaign_Name).subscribe((res:any)=>{
      this.data = res; 
    });  

    this.auth.getYesterdayWhatsAppLeads(this.campaign_Name).subscribe((res:any)=>{
      this.dataYesterday = res;
    });
 
    this.auth.getOneYesterdayWhatsAppLeads(this.campaign_Name).subscribe((res:any)=>{
      this.dataOneYesterday = res;
    });

    this.auth.getTwoYesterdayWhatsAppLeads(this.campaign_Name).subscribe((res:any)=>{
      this.dataTwoYesterday = res; 
    });

    this.auth.getThreeYesterdayWhatsAppLeads(this.campaign_Name).subscribe((res:any)=>{
      this.dataThreeYesterday = res;
    });

    this.auth.getFourYesterdayWhatsAppLeads(this.campaign_Name).subscribe((res:any)=>{
      this.dataFourYesterday = res;
    });

    this.auth.getFiveYesterdayWhatsAppLeads(this.campaign_Name).subscribe((res:any)=>{
      this.dataFiveYesterday = res;
    });
  }

  refreshPage(){
    window.location.reload();
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;
    const categ = this.categForm.value.campaign_Name;
    const projectStatus = this.searchForm.value.projectStatus;

    const filter = {
      startDate: startDateValue? new Date(startDateValue) : null,
      endDate: endDateValue? new Date(endDateValue) : null,
      categ: categ && categ !=='null' ? categ : null,
      projectStatus: projectStatus && projectStatus !=='null' ? projectStatus : null
    }

      this.auth.getSalesLeadbyRange(filter).subscribe((rangeData:any)=>{
        this.rangeData = rangeData;
      })
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

  updateProjectStatus(dataa: any){ 
    this.auth.updateProjectStatus(dataa).subscribe(( res: any)=>{
      if(dataa){
        this.toastr.success("Data Project Status Successfully Transfered","Success");
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
  }
  updateLeads(){
    this.auth.updateLead().subscribe((res:any)=>{
      this.modifyCount = res;
    });
  }
  facebookLeads(){
    const url = `/salesHome/team-leads`;
    window.location.href = url;
  }
  invoice(userId: string){
    const url = `/salesHome/est-invoice/${userId}`;
    window.open(url,'_blank');
  }
  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteSalesLead(id).subscribe((res : any)=>{
        this.data.splice(i,1);
        this.toastr.error("Data Delete Successfully", "Success");
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