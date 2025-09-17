// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../service/auth.service';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';

// declare var bootstrap: any;

// @Component({
//   selector: 'app-team-leads',
//   templateUrl: './team-leads.component.html',
//   styleUrls: ['./team-leads.component.css']
// })
// export class TeamLeadsComponent implements OnInit {

//   data: any;
//   dataYesterday: any;
//   dataOneYesterday: any;
//   dataTwoYesterday: any;
//   dataThreeYesterday: any;
//   dataFourYesterday: any;
//   dataFiveYesterday: any;
//   dataLength: any;
//   rangeData: any;
//   searchForm: FormGroup;
//   customers: any[] = [];
//   projects: any[] = [];
//   errorMessage: any;
//   tok: any;
//   Category: any;
//   emp: any;
//   todayDate: string;
//   yesterdayDate: string;
//   oneYesterdayDate: string;
//   twoYesterdayDate: string;
//   threeYesterdayDate: string;
//   fourYesterdayDate: string;
//   fiveYesterdayDate: string;
//   fbLeads: any;
//   modifyCount: any;
//   secondFbLeads: any;
//   transferName: any;
//   campaign_names: any;
//   whatsApp_campaign: any;
//   campaignName: any;
//   whatsAppCampaignName: any;
//   dynamicFields: string[] = [];
//   editing: boolean[] = []; // Tracks which campaign is being edited
//   editedNames: string[] = []; // Stores edited campaign names
//   dateData: any;
//   tag_names:any;
//   tagName:any;
//   dateDataWo:any;

//   data1:any;
//   yesData:any;
//   oneYesData:any;
//   twoYesData:any;
//   threeYesData:any;
//   fourYesData:any;
//   fiveYesData:any;

//   dateRangeForm = new FormGroup({
//     startDate: new FormControl(""),
//     endDate: new FormControl("")
//   });
//   categForm = new FormGroup({
//     campaign_name: new FormControl("null")
//   });
//   tagForm = new FormGroup({
//     tag_name: new FormControl("null")
//   });
//   whatsAppCateg = new FormGroup({
//     whatsApp_campaign_name: new FormControl("null")
//   });
//   leadDateForm = new FormGroup({
//     selectDate: new FormControl(null),
//     selectDate1: new FormControl(null)
//   });

//   updateButtonVisible: boolean = true;
//   selectedFile: File | null = null;

//   isUploading: boolean = false;
//   uploadStatus: string = '';

//   ngOnInit(): void {
//     // this.categForm.get('campaign_name')?.valueChanges.subscribe(value => {
//     //   this.campaignName = this.categForm.get('campaign_name')?.value;
//     //   if (this.whatsAppCateg.get('whatsApp_campaign_name')?.value !== 'null') {
//     //     this.whatsAppCateg.get('whatsApp_campaign_name')?.setValue('null', { emitEvent: false });
//     //   }
//     //   this.getgetData(); 
//     // });

//     this.tagForm.get('tag_name')?.valueChanges.subscribe(value => {
//       this.tagName = this.tagForm.get('tag_name')?.value;
//       this.getgetData();
//     });
  
//     this.whatsAppCateg.get('whatsApp_campaign_name')?.valueChanges.subscribe(value => {
//       this.whatsAppCampaignName = value;
//       if (this.categForm.get('campaign_name')?.value !== 'null') {
//         this.categForm.get('campaign_name')?.setValue('null', { emitEvent: false });
//       }
//       this.getWhatsAppData();
//     });
//      // Listen for changes on the selectDate form control
//     this.leadDateForm.get('selectDate')?.valueChanges.subscribe((date: string | null) => {
//       console.log('Selected Date:', date);
//     });
//   }
  
//   constructor(private auth: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService) {

//     this.auth.getProfile().subscribe((res: any) => {
//       this.tok = res?.data.salesTeam;
//       if (!this.tok) {
//         alert("Session Expired, Please Login Again");
//         this.auth.logout();
//       }
//     });

//     this.searchForm = this.formBuilder.group({
//       projectStatus: [''],
//       mobile: ['']
//     });
//     this.auth.salesFacebookLeads().subscribe((res: any) => {
//       this.fbLeads = res;
//     });
//     this.auth.salesSecondFacebookLeads().subscribe((res: any) => {
//       this.secondFbLeads = res;
//     });

//     this.auth.getCampaign().subscribe((res: any) => {
//       this.campaign_names = res;
//       console.log("Recent Campaign Names: ", this.campaign_names);
//     });
//     this.auth.getTag().subscribe((res:any) => {
//       this.tag_names = res;
//     });
//     this.auth.getWhatsAppCampaign().subscribe((res: any) => {
//       this.whatsApp_campaign = res;
//     });

//     this.todayDate = this.auth.getDate();
//     this.yesterdayDate = this.auth.getDate(-1);
//     this.oneYesterdayDate = this.auth.getDate(-2);
//     this.twoYesterdayDate = this.auth.getDate(-3);
//     this.threeYesterdayDate = this.auth.getDate(-4);
//     this.fourYesterdayDate = this.auth.getDate(-5);
//     this.fiveYesterdayDate = this.auth.getDate(-6);

//     this.auth.dataLength().subscribe((res: any) => {
//       this.dataLength = res;
//     });

//     this.auth.getCategory().subscribe((category: any) => {
//       this.Category = category;
//     });

//     this.auth.getSalesTeam().subscribe((res: any) => {
//       this.emp = res;
//     });

//     this.auth.getTeamLeadWo().subscribe((res:any)=>{
//       this.data1 = res;
//       this.dynamicFields = this.getDynamicFields(res);
//     });
//     this.auth.getYesterdayTeamLeadWo().subscribe((res:any)=>{
//       this.yesData = res;
//       // this.dynamicFields = this.getDynamicFields(res);
//     });
//     this.auth.getOneYesterdayTeamLeadWo().subscribe((res:any)=>{
//       this.oneYesData = res;
//       // this.dynamicFields = this.getDynamicFields(res);
//     });
//     this.auth.getTwoYesterdayTeamLeadWo().subscribe((res:any)=>{
//       this.twoYesData = res;
//       // this.dynamicFields = this.getDynamicFields(res);
//     });
//     this.auth.getThreeYesterdayTeamLeadWo().subscribe((res:any)=>{
//       this.threeYesData = res;
//       // this.dynamicFields = this.getDynamicFields(res);
//     });
//     this.auth.getFourYesterdayTeamLeadWo().subscribe((res:any)=>{
//       this.fourYesData = res;
//       // this.dynamicFields = this.getDynamicFields(res);
//     });
//     this.auth.getFiveYesterdayTeamLeadWo().subscribe((res:any)=>{
//       this.fiveYesData = res;
//       // this.dynamicFields = this.getDynamicFields(res);
//     });
//     //this.selectDate1 = this.leadDateForm.get('selectDate')?.value;
//     // this.auth.dateWo(this.selectDate1).subscribe((res:any)=>{
//     //   this.dateDataWo = res;
//     // });
//   }

//   getgetData() {
//     // this.auth.getTeamLeads(this.campaignName).subscribe((res: any) => {
//     this.auth.getTeamLeads(this.tagName).subscribe((res: any) => {
//       this.data = res;
//       // Extract dynamic fields
//       this.dynamicFields = this.getDynamicFields(res);
//       console.log("CAMPAIGN NAMEEEEEhui====================>>", this.tagName);
//       console.log("CAMPAIGN DATAAAAAAAAAAAAhui======================>>", this.data);
//       //console.log("DYNAMIC LEADS===========>>", this.dynamicFields);
//     });

//     this.auth.getYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
//       this.dataYesterday = res;
//             console.log("CAMPAIGN NAMEEEEEhui hui====================>>", this.campaignName);
//       console.log("CAMPAIGN DATAAAAAAAAAAAAhui hui======================>>", this.dataYesterday);
//     });

//     this.auth.getOneYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
//       this.dataOneYesterday = res;
//       this.dynamicFields = this.getDynamicFields(res);
//     });

//     this.auth.getTwoYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
//       this.dataTwoYesterday = res;
//     });

//     this.auth.getThreeYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
//       this.dataThreeYesterday = res;
//     });

//     this.auth.getFourYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
//       this.dataFourYesterday = res;
//     });

//     this.auth.getFiveYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
//       this.dataFiveYesterday = res;
//     });
//   }
//   getDynamicFields(data: any[]): string[] {
//     let fields = new Set<string>();
//     data.forEach(item => {
//       if (item.additionalFields) {
//         Object.keys(item.additionalFields).forEach(field => fields.add(field));
//       }
//     });
//     //console.log("DYNAMIC FIELDS============>>",fields);
//     return Array.from(fields);
//   }

//   refreshPage() {
//     window.location.reload();
//   }

//   onDate() {
//     const startDateValue = this.dateRangeForm.value.startDate;
//     const endDateValue = this.dateRangeForm.value.endDate;
//     const categ = this.categForm.value.campaign_name;
//     const projectStatus = this.searchForm.value.projectStatus;

//     const filter = {
//       startDate : startDateValue ? new Date(startDateValue) : null,
//       endDate : endDateValue ? new Date(endDateValue) : null,
//       categ : categ && categ !== 'null' ? categ : null,
//       projectStatus: projectStatus && projectStatus !=='null' ? projectStatus : null
//     }

//       this.auth.getSalesLeadbyRange(filter).subscribe((rangeData: any) => {
//         this.rangeData = rangeData;
//       })
    
//   } 

//   searchCustomer() {
//     const projectStatus = this.searchForm.get('projectStatus')!.value;
//     this.auth.searchCustomerbyProject(projectStatus).subscribe((customers) => {
//       this.projects = customers;
//       this.errorMessage = null;
//     },
//       error => {
//         this.projects = [];
//         this.errorMessage = error.message;
//       });
//   }
//   openUpdatePanel(userId: string) {
//     const url = `/salesHome/updateCustomer/${userId}`;
//     window.location.href = url;
//   }
//   invoice(userId: string) {
//     const url = `/salesHome/est-invoice/${userId}`;
//     window.open(url, '_blank');
//   }

//   updateProjectStatus(dataa: any) {
//     console.log("Sending data:", dataa);
//     this.auth.updateProjectStatus(dataa).subscribe((res: any) => {
//       if (dataa) {
//         // alert("Data Project Status Successfully Transfered");
//         this.toastr.success("Data stored Successfully", "Success");
//       }
//       console.log("SalesPerson Updated Successfully", res);
//     },
//     (err) => {
//       console.error("API error:", err);
//     })
//   }

//   downloadRangeFile() {
//     const startDateValue = this.dateRangeForm.value.startDate;
//     const endDateValue = this.dateRangeForm.value.endDate;

//     const startDate = startDateValue ? new Date(startDateValue) : null;
//     const endDate = endDateValue ? new Date(endDateValue) : null;

//     if (startDate && endDate) {
//       this.auth.downloadSalesRangeFile(startDate, endDate);
//     }
//   }
//   customLeads() {
//     const url = `/salesHome/custom-leads`;
//     window.location.href = url;
//   }
//   updateLeads() {
//     this.auth.updateLead().subscribe((res: any) => {
//       this.modifyCount = res;
//     });
//   }
//   whatsAppLeads() {
//     const url = `/salesHome/whatsApp-leads`;
//     window.location.href = url;
//   }
//   delete(id: any, i: any) {
//     if (window.confirm("Are you Sure want to Delete?")) {
//       this.auth.deleteSalesLead(id).subscribe((res: any) => {
//         this.data.splice(i, 1);
//         alert("Data Delete Successfully");
//         window.location.reload();
//       })
//     }
//   }
//   transferLead(user: any, newSalesTeam: any) {
//     const currentDate = new Date().toISOString();
//     const transferData = {
//       custId: user._id,              // Updated key name to match backend
//       salesTeam: newSalesTeam,       // Updated key name to match backend
//       closingDate: currentDate,       // Pass the current date as closing date
//       name: this.transferName
//     };
//     this.auth.transferToLeads(transferData).subscribe((res: any) => {
//       this.toastr.success("Transferred Successfully", "Success");
//     })
//   }

//   searchCustomerByName() {
//     const mobile = this.searchForm.get('mobile')!.value;
//     this.auth.searchCustomerbyMobileLeads(mobile).subscribe((customers) => {
//       this.customers = customers;
//       this.errorMessage = null;
//     },
//       error => {
//         this.customers = [];
//         this.errorMessage = error.message;
//       });
//   }

//   getWhatsAppData() {
//     this.auth.getTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
//       this.data = res;
//       // Extract dynamic fields
//       //this.dynamicFields = this.getDynamicFields(res);
//       //console.log("DYNAMIC LEADS===========>>", this.dynamicFields);
//     });

//     this.auth.getYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
//       this.dataYesterday = res;
//     });

//     this.auth.getOneYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
//       this.dataOneYesterday = res;
//     });

//     this.auth.getTwoYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
//       this.dataTwoYesterday = res;
//     });

//     this.auth.getThreeYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
//       this.dataThreeYesterday = res;
//     });

//     this.auth.getFourYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
//       this.dataFourYesterday = res;
//     });

//     this.auth.getFiveYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
//       this.dataFiveYesterday = res;
//     });
//   }
//   openchat(phone: number){
//     const subscriberId = phone;
//     window.open(`https://app.whatsmarketing.in/whatsapp/livechat?subscriber_id=${subscriberId}-71834`);
//   }

//   onFileChange(event: any) {
//     this.selectedFile = event.target.files[0];
//   }

//   // upload(){
//   //   if( !this.selectedFile) return;

//   //   const formData = new FormData();
//   //   formData.append('file', this.selectedFile);

//   //   this.auth.uploadLead(formData).subscribe({
//   //     next: (res) => {
//   //       this.toastr.success('File Upload Successful', "Success");
//   //       window.location.reload();
//   //     },
//   //     error: (err) => {
//   //       this.toastr.error('Error Uploading File', "Error");
//   //       console.error('Upload error', err);
//   //     }
//   //   });
//   // }
  
//   upload() {
//     if (!this.selectedFile) return;
  
//     this.isUploading = true;
//     this.uploadStatus = 'Uploading...';
  
//     // Show modal
//     const modal = new bootstrap.Modal(document.getElementById('uploadModal')!);
//     modal.show();
  
//     const formData = new FormData();
//     formData.append('file', this.selectedFile);
  
//     this.auth.uploadLead(formData).subscribe({
//       next: (res) => {
//         this.uploadStatus = 'Uploaded Successfully';
//         this.toastr.success('File Upload Successful', "Success");
//         this.isUploading = false;
//         setTimeout(() => {
//           modal.hide();
//           window.location.reload();
//         }, 1500);
//       },
//       error: (err) => {
//         this.uploadStatus = 'Upload Failed';
//         this.toastr.error('Error Uploading File', "Error");
//         this.isUploading = false;
//       }
//     });
//   }
//   sendDataToBackend(){
//     const selectDate = this.leadDateForm.get('selectDate')?.value;
//     const selectDate1 = this.leadDateForm.get('selectDate1')?.value;
//     const selectedCampaign = this.categForm.get('campaign_name')?.value;
//     const selectedWhatsAppCampaign = this. whatsAppCateg.get('whatsApp_campaign_name')?.value;

//     if(selectDate1){
//       this.auth.dateWo(selectDate1).subscribe((res:any)=>{
//       this.dateDataWo = res;
//     });
//     }

//     if(selectDate && selectedCampaign){
//       this.auth.dateCamapign(selectDate, selectedCampaign).subscribe((res:any) => {
//         this.dateData = res;
//       }, (err)=>{
//         console.error('API Error: ', err);
//       });
//     }else{
//       this.toastr.warning("Missing selection: Please ensure date and campaign",'Selection Error')
//       console.warn('Missing selection: Please ensure date and campaign');
//     }

//     if(selectDate && selectedWhatsAppCampaign){
//       // this.auth.dateWhatsAppCampaign(selectDate, selectedWhatsAppCampaign).subscribe((res:any)=>{
//       //   this.dateData = res;
//       // },(err)=>{
//       //   console.error('API Error: ',err);
//       // });
//       this.auth.dateCamapign(selectDate, selectedWhatsAppCampaign).subscribe((res:any) => {
//         this.dateData = res;
//       }, (err)=>{
//         console.error('API Error: ', err);
//       });
//     }else{
//       this.toastr.warning("Missing selection: Please ensure date and WhatsApp campaign",'Selection Error')
//         console.warn('Missing selection: Please wnsure date and whatsApp Campaign');
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

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

  // Changed to explicit string[] for clarity
  dynamicFields: string[] = [];

  editing: boolean[] = []; // Tracks which campaign is being edited
  editedNames: string[] = []; // Stores edited campaign names
  dateData: any;
  tag_names:any;
  tagName:any;
  dateDataWo:any;

  data1:any;
  yesData:any;
  oneYesData:any;
  twoYesData:any;
  threeYesData:any;
  fourYesData:any;
  fiveYesData:any;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_name: new FormControl("null")
  });
  tagForm = new FormGroup({
    tag_name: new FormControl("null")
  });
  whatsAppCateg = new FormGroup({
    whatsApp_campaign_name: new FormControl("null")
  });
  leadDateForm = new FormGroup({
    selectDate: new FormControl(null),
    selectDate1: new FormControl(null)
  });

  updateButtonVisible: boolean = true;
  selectedFile: File | null = null;

  isUploading: boolean = false;
  uploadStatus: string = '';

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef // in case you use OnPush or need manual markForCheck
  ) {

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
    this.auth.getTag().subscribe((res:any) => {
      this.tag_names = res;
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

    // Initial loads for the multiple "Wo" endpoints --
    // ensure we call updateDynamicFields() after each array is set
    this.auth.getTeamLeadWo().subscribe((res:any)=>{
      this.data1 = res || [];
      this.updateDynamicFields();
    });
    this.auth.getYesterdayTeamLeadWo().subscribe((res:any)=>{
      this.yesData = res || [];
      this.updateDynamicFields();
    });
    this.auth.getOneYesterdayTeamLeadWo().subscribe((res:any)=>{
      this.oneYesData = res || [];
      this.updateDynamicFields();
    });
    this.auth.getTwoYesterdayTeamLeadWo().subscribe((res:any)=>{
      this.twoYesData = res || [];
      this.updateDynamicFields();
    });
    this.auth.getThreeYesterdayTeamLeadWo().subscribe((res:any)=>{
      this.threeYesData = res || [];
      this.updateDynamicFields();
    });
    this.auth.getFourYesterdayTeamLeadWo().subscribe((res:any)=>{
      this.fourYesData = res || [];
      this.updateDynamicFields();
    });
    this.auth.getFiveYesterdayTeamLeadWo().subscribe((res:any)=>{
      this.fiveYesData = res || [];
      this.updateDynamicFields();
    });
    //this.selectDate1 = this.leadDateForm.get('selectDate')?.value;
    // this.auth.dateWo(this.selectDate1).subscribe((res:any)=>{
    //   this.dateDataWo = res;
    // });
  }

  ngOnInit(): void {
    this.tagForm.get('tag_name')?.valueChanges.subscribe(value => {
      this.tagName = this.tagForm.get('tag_name')?.value;
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

  /**********************
   * Data fetching area
   **********************/
  getgetData() {
    // main dataset
    this.auth.getTeamLeads(this.tagName).subscribe((res: any) => {
      this.data = res || [];
      // ensure any dataset used by templates is updated
      this.updateDynamicFields();
      console.log("CAMPAIGN NAME:", this.tagName);
      console.log("CAMPAIGN DATA:", this.data);
    });

    this.auth.getYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
      this.dataYesterday = res || [];
      this.updateDynamicFields();
      console.log("YESTERDAY DATA:", this.dataYesterday);
    });

    this.auth.getOneYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
      this.dataOneYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getTwoYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
      this.dataTwoYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getThreeYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
      this.dataThreeYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getFourYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
      this.dataFourYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getFiveYesterdayTeamLeads(this.tagName).subscribe((res: any) => {
      this.dataFiveYesterday = res || [];
      this.updateDynamicFields();
    });
  }

  getWhatsAppData() {
    this.auth.getTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.data = res || [];
      this.updateDynamicFields();
    });

    this.auth.getYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getOneYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataOneYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getTwoYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataTwoYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getThreeYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataThreeYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getFourYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataFourYesterday = res || [];
      this.updateDynamicFields();
    });

    this.auth.getFiveYesterdayTeamLeads(this.whatsAppCampaignName).subscribe((res: any) => {
      this.dataFiveYesterday = res || [];
      this.updateDynamicFields();
    });
  }

  /**
   * Build union of all additionalFields keys from every dataset you render.
   * Call this whenever any dataset changes.
   */
  updateDynamicFields() {
    const keys = new Set<string>();

    const datasets = [
      this.data1,
      this.yesData,
      this.oneYesData,
      this.twoYesData,
      this.threeYesData,
      this.fourYesData,
      this.fiveYesData,
      this.data,               // team leads filtered by tag/campaign
      this.dataYesterday,
      this.dataOneYesterday,
      this.dataTwoYesterday,
      this.dataThreeYesterday,
      this.dataFourYesterday,
      this.dataFiveYesterday
    ];

    datasets.forEach(arr => {
      if (!Array.isArray(arr)) return;
      arr.forEach(item => {
        if (item && item.additionalFields && typeof item.additionalFields === 'object') {
          Object.keys(item.additionalFields).forEach(k => keys.add(k));
        }
      });
    });

    // deterministic order (alphabetical).
    // Remove .sort() to preserve first-seen order instead.
    this.dynamicFields = Array.from(keys).sort();

    // If using OnPush, ensure change detection runs
    try { this.cd.markForCheck(); } catch (e) { /* ignore */ }
  }

  /**
   * Keep existing helper (single array) - still usable if you ever need it
   */
  getDynamicFields(data: any[]): string[] {
    let fields = new Set<string>();
    if (!Array.isArray(data)) return [];
    data.forEach(item => {
      if (item && item.additionalFields) {
        Object.keys(item.additionalFields).forEach(field => fields.add(field));
      }
    });
    return Array.from(fields);
  }

  /**********************
   * The rest of your methods (unchanged)...
   **********************/
  refreshPage() {
    window.location.reload();
  }

  onDate() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;
    const categ = this.categForm.value.campaign_name;
    const projectStatus = this.searchForm.value.projectStatus;

    const filter = {
      startDate : startDateValue ? new Date(startDateValue) : null,
      endDate : endDateValue ? new Date(endDateValue) : null,
      categ : categ && categ !== 'null' ? categ : null,
      projectStatus: projectStatus && projectStatus !=='null' ? projectStatus : null
    }

    this.auth.getSalesLeadbyRange(filter).subscribe((rangeData: any) => {
      this.rangeData = rangeData;
    })
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
    console.log("Sending data:", dataa);
    this.auth.updateProjectStatus(dataa).subscribe((res: any) => {
      if (dataa) {
        this.toastr.success("Data stored Successfully", "Success");
      }
      console.log("SalesPerson Updated Successfully", res);
    },
    (err) => {
      console.error("API error:", err);
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
      custId: user._id,
      salesTeam: newSalesTeam,
      closingDate: currentDate,
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

  openchat(phone: number){
    const subscriberId = phone;
    window.open(`https://app.whatsmarketing.in/whatsapp/livechat?subscriber_id=${subscriberId}-71834`);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

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
    const selectDate1 = this.leadDateForm.get('selectDate1')?.value;
    const selectedCampaign = this.categForm.get('campaign_name')?.value;
    const selectedWhatsAppCampaign = this. whatsAppCateg.get('whatsApp_campaign_name')?.value;

    if(selectDate1){
      this.auth.dateWo(selectDate1).subscribe((res:any)=>{
      this.dateDataWo = res;
    });
    }

    if(selectDate && selectedCampaign){
      this.auth.dateCamapign(selectDate, selectedCampaign).subscribe((res:any) => {
        this.dateData = res;
      }, (err)=>{
        console.error('API Error: ', err);
      });
    }else{
      this.toastr.warning("Missing selection: Please ensure date and campaign",'Selection Error')
      console.warn('Missing selection: Please ensure date and campaign');
    }

    if(selectDate && selectedWhatsAppCampaign){
      this.auth.dateCamapign(selectDate, selectedWhatsAppCampaign).subscribe((res:any) => {
        this.dateData = res;
      }, (err)=>{
        console.error('API Error: ', err);
      });
    }else{
      this.toastr.warning("Missing selection: Please ensure date and WhatsApp campaign",'Selection Error')
        console.warn('Missing selection: Please wnsure date and whatsApp Campaign');
    }
  }
}
