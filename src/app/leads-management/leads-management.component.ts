import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  dynamicFields: any;
  transferName: any;
  updateButtonVisible: boolean = true;

  paginatedLeads: any[] = [];
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 0;

  selectedLeads: any[] = [];
  selectAllOnPage = false;

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

  ngOnInit() {
    this.auth.allSalesLead().subscribe((res: any) => {
      this.allSalesLead = res;
      this.totalPages = Math.ceil(this.allSalesLead.length / this.itemsPerPage);
      this.updatePaginatedData();
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

    this.auth.getAssignedCampaigns().subscribe((res: any) => {
      this.campaigns = res.data.map((camp: any) => ({
        name: camp.campaignName,
        assignedEmployees: camp.employees || [],
        salesPerson1: camp.employees?.[0] || "",
        salesPerson2: camp.employees?.[1] || ""
      }));
      console.log("ASSIGNED CAMPAIGNS=====>>", this.campaigns);
    });

    this.auth.getCampaign().subscribe((res: any) => {
      this.campaign_names = res;
      console.log("Recent Campaign Names: ", this.campaign_names);
    });
    this.auth.allSalesLead().subscribe((res: any) => {
      this.allSalesLead = res;
      this.dynamicFields = this.getDynamicFields(res);
      console.log("ALL LEADS=======>>", this.allSalesLead);
    });
  }

  searchCustomerByName() {
    const mobile = this.searchForm.get('mobile')!.value;
    console.log('RUNNING');
    this.auth.searchCustomerbyMobileLeads(mobile).subscribe((customers) => {
      console.log("RUNNING DATA======>>", customers);
      this.customers = customers;
      this.errorMessage = null;
    }, error => {
      this.customers = [];
      this.errorMessage = error.message;
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
      employees: selectedEmployees
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
    }, error => {
      console.log("NOT FOUND");
      this.projects = [];
      this.errorMessage = error.message;
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
      this.rangeData = rangeData;
      console.log("RANGE DATA=====>>", this.rangeData);
    })
  }
  getDynamicFields(data: any[]): string[] {
    let fields = new Set<string>();
    data.forEach(item => {
      if (item.additionalFields) {
        Object.keys(item.additionalFields).forEach(field => fields.add(field));
      }
    });
    return Array.from(fields);
  }
  updateProjectStatus(data: any) {
    this.auth.updateProjectStatus(data).subscribe((res: any) => {
      if (data) {
        this.toastr.success("Data stored Successfully", "Success");
      } else {
        this.toastr.error("Data Not Stored", "Error");
      }
    })
  }
  invoice(userId: string) {
    const url = `/salesHome/est-invoice/${userId}`;
    window.open(url, '_blank');
  }
  transferLead() {

    const targetSalesPerson = this.salesForm.value.transferSalesPerson_name;

    if(!targetSalesPerson || targetSalesPerson === "null"){
      this.toastr.error("Please select a sales person to transfer");
      return;
    }
    if(this.selectedLeads.length === 0){
      this.toastr.error(" Please select at least One Lead");
      return;
    }

    const transferData = {
      leadIds: this.selectedLeads.map(lead => lead._id),
      transferTo: targetSalesPerson
    };
    
    this.auth.transferLeadtoSalesPerson(transferData).subscribe({
      next: (res:any)=>{
        this.toastr.success("Transfer Successfully", "Success");

        this.selectedLeads = [];
        this.selectAllOnPage = false;
      }, error: (err) =>{
        this.toastr.error("Transfer Fail", 'Error');
        console.error(err);
      }
    });
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLeads = this.allSalesLead.slice(startIndex, endIndex);
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
  }
}
