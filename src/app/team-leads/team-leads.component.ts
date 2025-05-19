import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-team-leads',
  templateUrl: './team-leads.component.html',
  styleUrls: ['./team-leads.component.css']
})
export class TeamLeadsComponent implements OnInit {

  data: any;
  dataYesterday: any;
  dataOneYesterday: any;
  dataTwoYesterday: any;
  dataThreeYesterday: any;
  dataFourYesterday: any;
  dataFiveYesterday: any;
  dataLength: any;
  rangeData: any;
  searchForm: FormGroup;
  customers: any[] = [];
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
  modifyCount: any;
  secondFbLeads: any;
  transferName: any;
  campaign_names: any;
  whatsApp_campaign: any;
  campaignName: any;
  whatsAppCampaignName: any;
  dynamicFields: any;
  editing: boolean[] = []; // Tracks which campaign is being edited
  editedNames: string[] = []; // Stores edited campaign names
  dateData: any;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_name: new FormControl("null")
  });
  whatsAppCateg = new FormGroup({
    whatsApp_campaign_name: new FormControl("null")
  });
  leadDateForm = new FormGroup({
    selectDate: new FormControl("null")
  });

  updateButtonVisible: boolean = true;
  selectedFile: File | null = null;

  isUploading: boolean = false;
  uploadStatus: string = '';
  


  // ngOnInit(): void {
  //   this.categForm.get('campaign_name')?.valueChanges.subscribe(value => {
  //     this.campaignName = value;
  //     //this.whatsAppCateg.get('whatsApp_campaign_name')?.setValue('null');
  //     this.getgetData();
  //   });
  //   this.whatsAppCateg.get('whatsApp_campaign_name')?.valueChanges.subscribe(value => {
  //     this.whatsAppCampaignName = value;
  //     //this.categForm.get('campaign_name')?.setValue('null');
  //     this.getWhatsAppData();
  //   });
  // }

  ngOnInit(): void {
    this.categForm.get('campaign_name')?.valueChanges.subscribe(value => {
      this.campaignName = this.categForm.get('campaign_name')?.value;
      if (this.whatsAppCateg.get('whatsApp_campaign_name')?.value !== 'null') {
        this.whatsAppCateg.get('whatsApp_campaign_name')?.setValue('null', { emitEvent: false });
      }
      this.getgetData(); 
    });
  
    this.whatsAppCateg.get('whatsApp_campaign_name')?.valueChanges.subscribe(value => {
      this.whatsAppCampaignName = value;
      if (this.categForm.get('campaign_name')?.value !== 'null') {
        this.categForm.get('campaign_name')?.setValue('null', { emitEvent: false });
      }
      this.getWhatsAppData();
    });
     // Listen for changes on the selectDate form control
    this.leadDateForm.get('selectDate')?.valueChanges.subscribe((date: string | null) => {
      console.log('Selected Date:', date);
    });
  }
  

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService) {

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data.salesTeam;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });

    this.searchForm = this.formBuilder.group({
      projectStatus: [''],
      mobile: ['']
    });
    this.auth.salesFacebookLeads().subscribe((res: any) => {
      this.fbLeads = res;
    });
    this.auth.salesSecondFacebookLeads().subscribe((res: any) => {
      this.secondFbLeads = res;
    });

    this.auth.getCampaign().subscribe((res: any) => {
      this.campaign_names = res;
      console.log("Recent Campaign Names: ", this.campaign_names);
    });
    this.auth.getWhatsAppCampaign().subscribe((res: any) => {
      this.whatsApp_campaign = res;
    });

    this.todayDate = this.auth.getDate();
    this.yesterdayDate = this.auth.getDate(-1);
    this.oneYesterdayDate = this.auth.getDate(-2);
    this.twoYesterdayDate = this.auth.getDate(-3);
    this.threeYesterdayDate = this.auth.getDate(-4);
    this.fourYesterdayDate = this.auth.getDate(-5);
    this.fiveYesterdayDate = this.auth.getDate(-6);

    this.auth.dataLength().subscribe((res: any) => {
      this.dataLength = res;
    });

    this.auth.getCategory().subscribe((category: any) => {
      this.Category = category;
    });

    this.auth.getSalesTeam().subscribe((res: any) => {
      this.emp = res;
    });
  }

  getgetData() {
    this.auth.getTeamLeads(this.campaignName).subscribe((res: any) => {
      this.data = res;
      // Extract dynamic fields
      this.dynamicFields = this.getDynamicFields(res);
      console.log("CAMPAIGN NAMEEEEEhui====================>>", this.campaignName);
      console.log("CAMPAIGN DATAAAAAAAAAAAAhui======================>>", this.data);
      //console.log("DYNAMIC LEADS===========>>", this.dynamicFields);
    });

    this.auth.getYesterdayTeamLeads(this.campaignName).subscribe((res: any) => {
      this.dataYesterday = res;
            console.log("CAMPAIGN NAMEEEEEhui hui====================>>", this.campaignName);
      console.log("CAMPAIGN DATAAAAAAAAAAAAhui hui======================>>", this.dataYesterday);
    });

    this.auth.getOneYesterdayTeamLeads(this.campaignName).subscribe((res: any) => {
      this.dataOneYesterday = res;
    });

    this.auth.getTwoYesterdayTeamLeads(this.campaignName).subscribe((res: any) => {
      this.dataTwoYesterday = res;
    });

    this.auth.getThreeYesterdayTeamLeads(this.campaignName).subscribe((res: any) => {
      this.dataThreeYesterday = res;
    });

    this.auth.getFourYesterdayTeamLeads(this.campaignName).subscribe((res: any) => {
      this.dataFourYesterday = res;
    });

    this.auth.getFiveYesterdayTeamLeads(this.campaignName).subscribe((res: any) => {
      this.dataFiveYesterday = res;
    });
  }
  getDynamicFields(data: any[]): string[] {
    let fields = new Set<string>();
    data.forEach(item => {
      if (item.additionalFields) {
        Object.keys(item.additionalFields).forEach(field => fields.add(field));
      }
    });
    //console.log("DYNAMIC FIELDS============>>",fields);
    return Array.from(fields);
  }

  refreshPage() {
    window.location.reload();
  }

  onDate() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;
    const categ = this.categForm.value.campaign_name;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate && categ) {
      this.auth.getSalesLeadbyRange(startDate, endDate, categ).subscribe((rangeData: any) => {
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }

  searchCustomer() {
    const projectStatus = this.searchForm.get('projectStatus')!.value;
    this.auth.searchCustomerbyProject(projectStatus).subscribe((customers) => {
      this.projects = customers;
      this.errorMessage = null;
    },
      error => {
        this.projects = [];
        this.errorMessage = error.message;
      });
  }
  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    window.location.href = url;
  }
  invoice(userId: string) {
    const url = `/salesHome/est-invoice/${userId}`;
    window.open(url, '_blank');
  }

  updateProjectStatus(dataa: any) {
    this.auth.updateProjectStatus(dataa).subscribe((res: any) => {
      if (dataa) {
        // alert("Data Project Status Successfully Transfered");
        this.toastr.success("Data stored Successfully", "Success");
      }
      console.log("SalesPerson Updated Successfully", res);
    })
  }

  downloadRangeFile() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.downloadSalesRangeFile(startDate, endDate);
    }
  }
  customLeads() {
    const url = `/salesHome/custom-leads`;
    window.location.href = url;
  }
  updateLeads() {
    this.auth.updateLead().subscribe((res: any) => {
      this.modifyCount = res;
    });
  }
  whatsAppLeads() {
    const url = `/salesHome/whatsApp-leads`;
    window.location.href = url;
  }
  delete(id: any, i: any) {
    if (window.confirm("Are you Sure want to Delete?")) {
      this.auth.deleteSalesLead(id).subscribe((res: any) => {
        this.data.splice(i, 1);
        alert("Data Delete Successfully");
        window.location.reload();
      })
    }
  }
  transferLead(user: any, newSalesTeam: any) {
    const currentDate = new Date().toISOString();
    const transferData = {
      custId: user._id,              // Updated key name to match backend
      salesTeam: newSalesTeam,       // Updated key name to match backend
      closingDate: currentDate,       // Pass the current date as closing date
      name: this.transferName
    };
    this.auth.transferToLeads(transferData).subscribe((res: any) => {
      this.toastr.success("Transferred Successfully", "Success");
    })
  }

  searchCustomerByName() {
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobileLeads(mobile).subscribe((customers) => {
      this.customers = customers;
      this.errorMessage = null;
    },
      error => {
        this.customers = [];
        this.errorMessage = error.message;
      });
  }

  getWhatsAppData() {
    this.auth.getTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.data = res;
      // Extract dynamic fields
      //this.dynamicFields = this.getDynamicFields(res);
      //console.log("DYNAMIC LEADS===========>>", this.dynamicFields);
    });

    this.auth.getYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataYesterday = res;
    });

    this.auth.getOneYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataOneYesterday = res;
    });

    this.auth.getTwoYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataTwoYesterday = res;
    });

    this.auth.getThreeYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataThreeYesterday = res;
    });

    this.auth.getFourYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataFourYesterday = res;
    });

    this.auth.getFiveYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataFiveYesterday = res;
    });
  }
  openchat(phone: number){
    const subscriberId = phone;
    window.open(`https://app.whatsmarketing.in/whatsapp/livechat?subscriber_id=${subscriberId}-71834`);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // upload(){
  //   if( !this.selectedFile) return;

  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile);

  //   this.auth.uploadLead(formData).subscribe({
  //     next: (res) => {
  //       this.toastr.success('File Upload Successful', "Success");
  //       window.location.reload();
  //     },
  //     error: (err) => {
  //       this.toastr.error('Error Uploading File', "Error");
  //       console.error('Upload error', err);
  //     }
  //   });
  // }
  
  upload() {
    if (!this.selectedFile) return;
  
    this.isUploading = true;
    this.uploadStatus = 'Uploading...';
  
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('uploadModal')!);
    modal.show();
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.auth.uploadLead(formData).subscribe({
      next: (res) => {
        this.uploadStatus = 'Uploaded Successfully';
        this.toastr.success('File Upload Successful', "Success");
        this.isUploading = false;
        setTimeout(() => {
          modal.hide();
          window.location.reload();
        }, 1500);
      },
      error: (err) => {
        this.uploadStatus = 'Upload Failed';
        this.toastr.error('Error Uploading File', "Error");
        this.isUploading = false;
      }
    });
  }
  sendDataToBackend(){
    const selectDate = this.leadDateForm.get('selectDate')?.value;
    const selectedCampaign = this.categForm.get('campaign_name')?.value;
    const selectedWhatsAppCampaign = this. whatsAppCateg.get('whatsApp_campaign_name')?.value;

    if(selectDate && selectedCampaign){
      this.auth.dateCamapign(selectDate, selectedCampaign).subscribe((res:any) => {
        this.dateData = res;
      }, (err)=>{
        console.error('API Error: ', err);
      });
    }else{
      console.warn('Missing selection: Please ensure date and campaign');
    }

    if(selectDate && selectedWhatsAppCampaign){
      // this.auth.dateWhatsAppCampaign(selectDate, selectedWhatsAppCampaign).subscribe((res:any)=>{
      //   this.dateData = res;
      // },(err)=>{
      //   console.error('API Error: ',err);
      // });
      this.auth.dateCamapign(selectDate, selectedWhatsAppCampaign).subscribe((res:any) => {
        this.dateData = res;
      }, (err)=>{
        console.error('API Error: ', err);
      });
    }else{
        console.warn('Missing selection: Please wnsure date and whatsApp Campaign');
    }
  }
}