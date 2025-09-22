// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../service/auth.service';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// declare var bootstrap: any; // If using plain Bootstrap JS

// @Component({
//   selector: 'app-leads-management',
//   templateUrl: './leads-management.component.html',
//   styleUrl: './leads-management.component.css'
// })
// export class LeadsManagementComponent implements OnInit {

//   tok: any;
//   searchForm: FormGroup;
//   customers: any;
//   errorMessage: any;
//   emp: any[] = [];
//   campaigns: any;
//   salesEmp: any;
//   selectedCampaign: any = null;
//   projects: any;
//   rangeData: any;
//   campaign_names: any;
//   allSalesLead: any;
//   dynamicFields: any;
//   transferName: any;
//   updateButtonVisible: boolean = true;

//   paginatedLeads: any[] = [];
//   currentPage = 1;
//   itemsPerPage = 20;
//   totalPages = 0;

//   selectedLeads: any[] = [];
//   selectAllOnPage = false;

//   dateRangeForm = new FormGroup({
//     startDate: new FormControl(""),
//     endDate: new FormControl("")
//   });
//   categForm = new FormGroup({
//     campaign_name: new FormControl("null")
//   });
//   salesForm = new FormGroup({
//     salesPerson_name: new FormControl("null"),
//     transferSalesPerson_name: new FormControl("null")
//   });

//   file: File | null = null;
//   message = '';

//   Tagmessage = '';
//   className = '';
//   isProcess = false;
//   tagNames:any;

//   tagForm = new FormGroup({
//     tagName: new FormControl("")
//   });

//   ngOnInit() {
//     this.auth.allSalesLead().subscribe((res: any) => {
//       this.allSalesLead = res;
//       this.totalPages = Math.ceil(this.allSalesLead.length / this.itemsPerPage);
//       this.updatePaginatedData();
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

//     this.auth.allEmployee().subscribe((res: any) => {
//       if (Array.isArray(res)) {
//         this.salesEmp = res.filter((empS: any) => empS.signupRole && empS.signupRole.includes('Sales Team'));
//         console.log("SALES PERSON=======>>", this.salesEmp);
//       } else {
//         console.log("Unexpected response format", res);
//       }
//     });

//     this.auth.getAssignedCampaigns().subscribe((res: any) => {
//       this.campaigns = res.data.map((camp: any) => ({
//         name: camp.campaignName,
//         assignedEmployees: camp.employees || [],
//         salesPerson1: camp.employees?.[0] || "",
//         salesPerson2: camp.employees?.[1] || "",
//         tag: camp.tag || []
//       }));
//       console.log("ASSIGNED CAMPAIGNS=====>>", this.campaigns);
//     });

//     this.auth.getCampaign().subscribe((res: any) => {
//       this.campaign_names = res;
//       console.log("Recent Campaign Names: ", this.campaign_names);
//     });
//     this.auth.allSalesLead().subscribe((res: any) => {
//       this.allSalesLead = res;
//       this.dynamicFields = this.getDynamicFields(res);
//       console.log("ALL LEADS=======>>", this.allSalesLead);
//     });
//     this.auth.getTag().subscribe((res:any) => {
//       this.tagNames = res;
//     });
//   }

//   searchCustomerByName() {
//     const mobile = this.searchForm.get('mobile')!.value;
//     console.log('RUNNING');
//     this.auth.searchCustomerbyMobileLeads(mobile).subscribe((customers) => {
//       console.log("RUNNING DATA======>>", customers);
//       this.customers = customers;
//       this.errorMessage = null;
//     }, error => {
//       this.customers = [];
//       this.errorMessage = error.message;
//     });
//   }

//   assign(camp: any) {
//     const selectedEmployees = [camp.salesPerson1, camp.salesPerson2].filter(emp => emp);
//     if (!selectedEmployees.length) {
//       alert("Please select atleast One SalesPerson");
//       return;
//     }
//     const payload = {
//       campaignName: camp.name,
//       employees: selectedEmployees,
//       tag: camp.tag
//     }
//     this.auth.assignCampaign(payload).subscribe((res: any) => {
//       this.toastr.success("Campaign Assigned Successfully", 'success');
//     }, (err) => {
//       this.toastr.error("Error Assigning Campaign", 'error');
//       console.error("Error Assigning Campaign: ", err);
//     });
//   }
//   onCampaignChange() {
//     // Agar future me selectedCampaign me kuch aur set karna ho to yahan kar sakte ho
//     console.log("Selected Campaign:", this.selectedCampaign);
//   }

//   searchCustomer() {
//     const projectStatus = this.searchForm.get('projectStatus')!.value;
//     this.auth.searchCustomerbyProject(projectStatus).subscribe((customer) => {
//       console.log("FOUND");
//       this.projects = customer;
//       this.errorMessage = null;
//     }, error => {
//       console.log("NOT FOUND");
//       this.projects = [];
//       this.errorMessage = error.message;
//     });
//   }
 
//   onDate() {
//     const startDateValue = this.dateRangeForm.value.startDate;
//     const endDateValue = this.dateRangeForm.value.endDate;
//     const campaign = this.categForm.value.campaign_name;
//     const salesPerson = this.salesForm.value.salesPerson_name;
//     const projectStatus = this.searchForm.value.projectStatus;

//     const filter = {
//       startDate: startDateValue || null,
//       endDate: endDateValue || null,
//       campaign: campaign && campaign !== 'null' ? campaign : null,
//       salesPerson: salesPerson && salesPerson !== 'null' ? salesPerson : null,
//       projectStatus: projectStatus && projectStatus !== 'null' ? projectStatus : null
//     };

//     this.auth.getSalesLeadbyFilter(filter).subscribe((rangeData: any) => {
//       this.rangeData = rangeData;
//       console.log("RANGE DATA=====>>", this.rangeData);
//     })
//   }
//   getDynamicFields(data: any[]): string[] {
//     let fields = new Set<string>();
//     data.forEach(item => {
//       if (item.additionalFields) {
//         Object.keys(item.additionalFields).forEach(field => fields.add(field));
//       }
//     });
//     return Array.from(fields);
//   }
//   updateProjectStatus(data: any) {
//     this.auth.updateProjectStatus(data).subscribe((res: any) => {
//       if (data) {
//         this.toastr.success("Data stored Successfully", "Success");
//       } else {
//         this.toastr.error("Data Not Stored", "Error");
//       }
//     })
//   }
//   invoice(userId: string) {
//     const url = `/salesHome/est-invoice/${userId}`;
//     window.open(url, '_blank');
//   }
//   transferLead() {

//     const targetSalesPerson = this.salesForm.value.transferSalesPerson_name;

//     if (!targetSalesPerson || targetSalesPerson === "null") {
//       this.toastr.error("Please select a sales person to transfer");
//       return;
//     }
//     if (this.selectedLeads.length === 0) {
//       this.toastr.error(" Please select at least One Lead");
//       return;
//     }

//     const transferData = {
//       leadIds: this.selectedLeads.map(lead => lead._id),
//       transferTo: targetSalesPerson
//     };

//     this.auth.transferLeadtoSalesPerson(transferData).subscribe({
//       next: (res: any) => {
//         this.toastr.success("Transfer Successfully", "Success");

//         this.selectedLeads = [];
//         this.selectAllOnPage = false;
//       }, error: (err) => {
//         this.toastr.error("Transfer Fail", 'Error');
//         console.error(err);
//       }
//     });
//   }

//   updatePaginatedData() {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     this.paginatedLeads = this.allSalesLead.slice(startIndex, endIndex);
//   }

//   goToPage(page: number) {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.updatePaginatedData();
//     }
//   }

//   toggleSelectAll() {
//     if (this.selectAllOnPage) {
//       // Select all leads on the current page
//       this.selectedLeads = [
//         ...this.selectedLeads,
//         ...this.paginatedLeads.filter(
//           lead => !this.selectedLeads.some(sel => sel._id === lead._id)
//         )
//       ];
//     } else {
//       // Remove all leads on the current page from selection
//       this.selectedLeads = this.selectedLeads.filter(
//         sel => !this.paginatedLeads.some(pageLead => pageLead._id === sel._id)
//       );
//     }
//   }

//   isSelected(lead: any) {
//     return this.selectedLeads.some(sel => sel._id === lead._id);
//   }

//   toggleRowSelection(lead: any) {
//     if (this.isSelected(lead)) {
//       this.selectedLeads = this.selectedLeads.filter(sel => sel._id !== lead._id);
//     } else {
//       this.selectedLeads.push(lead);
//     }

//     // Update "select all" checkbox status
//     this.selectAllOnPage = this.paginatedLeads.every(lead => this.isSelected(lead));
//   }


//   onFileSelected(event: any) {
//     this.file = event.target.files[0];
//   }

//   uploadFile() {
//     if (!this.file) {
//       this.message = "⚠️ Please select a file first!";
//       return;
//     }

//     this.auth.uploadExcel(this.file).subscribe({
//       next: (res: Blob) => {
//         if (res.type === 'application/json') {
//           // text response (all matched)
//           this.message = "✅ All leads matched and updated!";
//         } else {
//           // file response (unmatched leads Excel)
//           const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//           const link = document.createElement('a');
//           link.href = window.URL.createObjectURL(blob);
//           link.download = 'unmatched_leads.xlsx';
//           link.click();
//           this.message = "⚠️ Some leads unmatched. File downloaded!";
//         }
//       },
//       error: (err) => {
//         this.message = "❌ Error uploading file.";
//       }
//     });
//   }

//   onTagChange(event: any) {
//     if (event.target.value === 'New Tag') {
//       // Open Bootstrap modal
//       let modal = new bootstrap.Modal(document.getElementById('tagModal'));
//       modal.show();
//     }
//   }

//   saveTag() {
//     this.isProcess = true;
//     const data = this.tagForm.value;

//     this.auth.newTag(data).subscribe({
//       next: (res: any) => {
//         this.isProcess = false;
//         if (res.success) {
//           this.Tagmessage = "Tag has been Created!!";
//           this.className = 'alert alert-success';

//           // Add new tag to list
//           const newTag = { tagName: data.tagName };
//           this.tagNames.push(newTag);

//           // Select new tag automatically
//           this.selectedCampaign.tag = data.tagName;

//           // Close modal
//           let modal = bootstrap.Modal.getInstance(document.getElementById('tagModal'));
//           modal.hide();

//           // Reset form
//           this.tagForm.reset();
//         } else {
//           this.Tagmessage = res.message;
//           this.className = 'alert alert-danger';
//         }
//       },
//       error: () => {
//         this.isProcess = false;
//         this.Tagmessage = "Server Error";
//         this.className = 'alert alert-danger';
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any; // If using plain Bootstrap JS

@Component({
  selector: 'app-leads-management',
  templateUrl: './leads-management.component.html',
  styleUrl: './leads-management.component.css'
})
export class LeadsManagementComponent implements OnInit {

  tok: any;
  searchForm: FormGroup;
  customers: any;
  errorMessage: any;
  emp: any[] = [];
  campaigns: any;
  salesEmp: any;
  selectedCampaign: any = null;
  projects: any;
  rangeData: any;
  campaign_names: any;
  allSalesLead: any;
  
  // make explicit that this holds strings
  dynamicFields: string[] = [];

  transferName: any;
  updateButtonVisible: boolean = true;

  paginatedLeads: any[] = [];
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 0;

  selectedLeads: any[] = [];
  selectAllOnPage = false;

  // For all leads table
  selectedAllLeads: any[] = [];
  selectAllAllLeads = false;
  
  // For rangeData table
  selectedRangeLeads: any[] = [];
  selectAllRange = false;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  categForm = new FormGroup({
    campaign_name: new FormControl("null")
  });
  salesForm = new FormGroup({
    salesPerson_name: new FormControl("null"),
    transferSalesPerson_name: new FormControl("null")
  });

  file: File | null = null;
  message = '';

  Tagmessage = '';
  className = '';
  isProcess = false;
  tagNames:any;

  tagForm = new FormGroup({
    tagName: new FormControl("")
  });

  ngOnInit() {
    this.auth.allSalesLead().subscribe((res: any) => {
      this.allSalesLead = res || [];
      this.totalPages = Math.ceil((this.allSalesLead?.length || 0) / this.itemsPerPage);
      this.updatePaginatedData();
      this.updateDynamicFields();
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

    this.auth.allEmployee().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.salesEmp = res.filter((empS: any) => empS.signupRole && empS.signupRole.includes('Sales Team'));
        console.log("SALES PERSON=======>>", this.salesEmp);
      } else {
        console.log("Unexpected response format", res);
      }
    });

    //new new

     this.auth.allSalesLead().subscribe((res: any) => {
      this.allSalesLead = res || [];
      this.totalPages = Math.ceil((this.allSalesLead.length || 0) / this.itemsPerPage);
      this.updatePaginatedData();
      this.updateDynamicFields();
    });

    this.auth.getAssignedCampaigns().subscribe((res: any) => {
      this.campaigns = res.data.map((camp: any) => ({
        name: camp.campaignName,
        assignedEmployees: camp.employees || [],
        salesPerson1: camp.employees?.[0] || "",
        salesPerson2: camp.employees?.[1] || "",
        tag: camp.tag || []
      }));
      console.log("ASSIGNED CAMPAIGNS=====>>", this.campaigns);
    });

    this.auth.getCampaign().subscribe((res: any) => {
      this.campaign_names = res;
      console.log("Recent Campaign Names: ", this.campaign_names);
    });

    // initial load of all leads (constructor). keep but update dynamic fields afterwards
    // this.auth.allSalesLead().subscribe((res: any) => {
    //   this.allSalesLead = res || [];
    //   this.dynamicFields = this.getDynamicFields(res || []);
    //   // ensure union in case other datasets load later
    //   this.updateDynamicFields();
    //   console.log("ALL LEADS=======>>", this.allSalesLead);
    // });

    this.auth.getTag().subscribe((res:any) => {
      this.tagNames = res;
    });
  }

  // === Utility getters ===
  get anySelected(): boolean {
    return (this.selectedRangeLeads.length + this.selectedAllLeads.length) > 0;
  }

  get combinedSelectedLeads(): any[] {
    const map = new Map<string, any>();
    this.selectedRangeLeads.forEach(l => { if (l && l._id) map.set(l._id, l); });
    this.selectedAllLeads.forEach(l => { if (l && l._id) map.set(l._id, l); });
    return Array.from(map.values());
  }

  searchCustomerByName() {
    const mobile = this.searchForm.get('mobile')!.value;
    console.log('RUNNING');
    this.auth.searchCustomerbyMobileLeads(mobile).subscribe((customers) => {
      console.log("RUNNING DATA======>>", customers);
      this.customers = customers;
      this.errorMessage = null;
      this.updateDynamicFields();
    }, error => {
      this.customers = [];
      this.errorMessage = error.message;
      this.updateDynamicFields();
    });
  }

  assign(camp: any) {
    const selectedEmployees = [camp.salesPerson1, camp.salesPerson2].filter(emp => emp);
    if (!selectedEmployees.length) {
      alert("Please select atleast One SalesPerson");
      return;
    }
    const payload = {
      campaignName: camp.name,
      employees: selectedEmployees,
      tag: camp.tag
    }
    this.auth.assignCampaign(payload).subscribe((res: any) => {
      this.toastr.success("Campaign Assigned Successfully", 'success');
    }, (err) => {
      this.toastr.error("Error Assigning Campaign", 'error');
      console.error("Error Assigning Campaign: ", err);
    });
  }
  onCampaignChange() {
    // Agar future me selectedCampaign me kuch aur set karna ho to yahan kar sakte ho
    console.log("Selected Campaign:", this.selectedCampaign);
  }

  searchCustomer() {
    const projectStatus = this.searchForm.get('projectStatus')!.value;
    this.auth.searchCustomerbyProject(projectStatus).subscribe((customer) => {
      console.log("FOUND");
      this.projects = customer;
      this.errorMessage = null;
      this.updateDynamicFields();
    }, error => {
      console.log("NOT FOUND");
      this.projects = [];
      this.errorMessage = error.message;
      this.updateDynamicFields();
    });
  }
 
  onDate() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;
    const campaign = this.categForm.value.campaign_name;
    const salesPerson = this.salesForm.value.salesPerson_name;
    const projectStatus = this.searchForm.value.projectStatus;

    const filter = {
      startDate: startDateValue || null,
      endDate: endDateValue || null,
      campaign: campaign && campaign !== 'null' ? campaign : null,
      salesPerson: salesPerson && salesPerson !== 'null' ? salesPerson : null,
      projectStatus: projectStatus && projectStatus !== 'null' ? projectStatus : null
    };

    this.auth.getSalesLeadbyFilter(filter).subscribe((rangeData: any) => {
      this.rangeData = rangeData || [];
      console.log("RANGE DATA=====>>", this.rangeData);
      this.updateDynamicFields();
    })
  }

  /**
   * Build union of keys from all data sources used in this component
   * so header always shows every possible additional field.
   */
  updateDynamicFields() {
    const keys = new Set<string>();

    const datasets: any[] = [
      this.allSalesLead,
      this.rangeData,
      this.paginatedLeads,
      this.customers,
      this.projects,
      this.selectedLeads
    ];

    datasets.forEach(ds => {
      if (Array.isArray(ds)) {
        ds.forEach(item => {
          if (item && item.additionalFields && typeof item.additionalFields === 'object') {
            Object.keys(item.additionalFields).forEach(k => keys.add(k));
          }
        });
      } else if (ds && typeof ds === 'object' && ds.additionalFields) {
        // handle single-object responses
        Object.keys(ds.additionalFields).forEach(k => keys.add(k));
      }
    });

    // deterministic alphabetical order. Remove .sort() to preserve first-seen order.
    this.dynamicFields = Array.from(keys).sort();
  }

  getDynamicFields(data: any[]): string[] {
    let fields = new Set<string>();
    if (!Array.isArray(data)) return [];
    data.forEach(item => {
      if (item.additionalFields) {
        Object.keys(item.additionalFields).forEach(field => fields.add(field));
      }
    });
    return Array.from(fields);
  }

  // in leads-management.component.ts
updateProjectStatus(data: any) {
  // send as array (server expects array or will accept single converted to array)
  this.auth.updateProjectStatusManagement([data]).subscribe({
    next: (res: any) => {
      // server returns { success: true, results: [...] }
      if (res && res.success) {
        this.toastr.success("Data stored Successfully", "Success");
      } else {
        this.toastr.error("Data Not Stored", "Error");
        console.error('update-projectStatusManagement response:', res);
      }
    },
    error: (err) => {
      console.error('updateProjectStatus error', err);
      this.toastr.error("Server Error while updating", "Error");
    }
  });
}

  invoice(userId: string) {
    const url = `/salesHome/est-invoice/${userId}`;
    window.open(url, '_blank');
  }
  transferLead() {

    const targetSalesPerson = this.salesForm.value.transferSalesPerson_name;

    if (!targetSalesPerson || targetSalesPerson === "null") {
      this.toastr.error("Please select a sales person to transfer");
      return;
    }
    const selectedLeads = this.combinedSelectedLeads;
    if (selectedLeads.length === 0) {
      this.toastr.error(" Please select at least One Lead");
      return;
    }

    const transferData = {
      leadIds: selectedLeads.map(lead => lead._id),
      transferTo: targetSalesPerson
    };

    this.auth.transferLeadtoSalesPerson(transferData).subscribe({
      next: (res: any) => {
        this.toastr.success("Transfer Successfully", "Success");

        this.selectedLeads = [];
        this.selectAllOnPage = false;
        this.selectedRangeLeads = [];
        this.selectedAllLeads = [];
        this.selectAllRange = false;
        this.selectAllAllLeads = false;
        // in case the server updated leads and changed fields, refresh union
        this.updateDynamicFields();
      }, error: (err) => {
        this.toastr.error("Transfer Fail", 'Error');
        console.error(err);
      }
    });
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLeads = (this.allSalesLead || []).slice(startIndex, endIndex);
    this.updateDynamicFields();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  toggleSelectAll() {
    if (this.selectAllOnPage) {
      // Select all leads on the current page
      this.selectedLeads = [
        ...this.selectedLeads,
        ...this.paginatedLeads.filter(
          lead => !this.selectedLeads.some(sel => sel._id === lead._id)
        )
      ];
    } else {
      // Remove all leads on the current page from selection
      this.selectedLeads = this.selectedLeads.filter(
        sel => !this.paginatedLeads.some(pageLead => pageLead._id === sel._id)
      );
    }
    // selection change shouldn't affect dynamicFields typically, but safe to call
    this.updateDynamicFields();
  }

  isSelected(lead: any) {
    return this.selectedLeads.some(sel => sel._id === lead._id);
  }

  toggleRowSelection(lead: any) {
    if (this.isSelected(lead)) {
      this.selectedLeads = this.selectedLeads.filter(sel => sel._id !== lead._id);
    } else {
      this.selectedLeads.push(lead);
    }

    // Update "select all" checkbox status
    this.selectAllOnPage = this.paginatedLeads.every(lead => this.isSelected(lead));
    // selection change doesn't modify fields but safe to update anyway
    this.updateDynamicFields();
  }

  // ---- RangeData table ----
toggleSelectAllRange(checked: boolean) {
  this.selectAllRange = checked;
  if (checked) {
    this.selectedRangeLeads = [...this.rangeData];
  } else {
    this.selectedRangeLeads = [];
  }
}

isSelectedRange(lead: any) {
  return this.selectedRangeLeads.some(sel => sel._id === lead._id);
}

toggleRowRange(lead: any) {
  if (this.isSelectedRange(lead)) {
    this.selectedRangeLeads = this.selectedRangeLeads.filter(sel => sel._id !== lead._id);
  } else {
    this.selectedRangeLeads.push(lead);
  }
  this.selectAllRange = this.rangeData.every((l:any) => this.isSelectedRange(l));
}

// ---- All Leads table ----
toggleSelectAllAllLeads(checked: boolean) {
  this.selectAllAllLeads = checked;
  if (checked) {
    this.selectedAllLeads = [...this.paginatedLeads];
  } else {
    this.selectedAllLeads = [];
  }
}

isSelectedAll(lead: any) {
  return this.selectedAllLeads.some(sel => sel._id === lead._id);
}

toggleRowAll(lead: any) {
  if (this.isSelectedAll(lead)) {
    this.selectedAllLeads = this.selectedAllLeads.filter(sel => sel._id !== lead._id);
  } else {
    this.selectedAllLeads.push(lead);
  }
  this.selectAllAllLeads = this.paginatedLeads.every(l => this.isSelectedAll(l));
}



  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (!this.file) {
      this.message = "⚠️ Please select a file first!";
      return;
    }

    this.auth.uploadExcel(this.file).subscribe({
      next: (res: Blob) => {
        if (res.type === 'application/json') {
          // text response (all matched)
          this.message = "✅ All leads matched and updated!";
          // if server updated leads structure, fetch all leads again (optional)
          this.auth.allSalesLead().subscribe((all: any) => {
            this.allSalesLead = all || [];
            this.updatePaginatedData();
            this.updateDynamicFields();
          });
        } else {
          // file response (unmatched leads Excel)
          const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'unmatched_leads.xlsx';
          link.click();
          this.message = "⚠️ Some leads unmatched. File downloaded!";
        }
      },
      error: (err) => {
        this.message = "❌ Error uploading file.";
      }
    });
  }

  onTagChange(event: any) {
    if (event.target.value === 'New Tag') {
      // Open Bootstrap modal
      let modal = new bootstrap.Modal(document.getElementById('tagModal'));
      modal.show();
    }
  }

  saveTag() {
    this.isProcess = true;
    const data = this.tagForm.value;

    this.auth.newTag(data).subscribe({
      next: (res: any) => {
        this.isProcess = false;
        if (res.success) {
          this.Tagmessage = "Tag has been Created!!";
          this.className = 'alert alert-success';

          // Add new tag to list
          const newTag = { tagName: data.tagName };
          this.tagNames.push(newTag);

          // Select new tag automatically
          this.selectedCampaign.tag = data.tagName;

          // Close modal
          let modal = bootstrap.Modal.getInstance(document.getElementById('tagModal'));
          modal.hide();

          // Reset form
          this.tagForm.reset();
        } else {
          this.Tagmessage = res.message;
          this.className = 'alert alert-danger';
        }
      },
      error: () => {
        this.isProcess = false;
        this.Tagmessage = "Server Error";
        this.className = 'alert alert-danger';
      }
    });
  }
}
