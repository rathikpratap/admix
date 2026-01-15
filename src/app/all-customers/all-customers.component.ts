import { Component, ViewChild, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css']
})
export class AllCustomersComponent {

  @ViewChild('fileInput') fileInput: any;
  selectedFile: File | null = null;

  tok: any;
  data: any = [];
  searchForm: FormGroup;
  customers: any[] = [];
  errorMessage: any;
  previousMonthName: string;
  previousTwoMonthName: string;
  currentMonthName: string;
  dataPreviousMonth: any = [];
  dataTwoPreviousMonth: any = [];
  isExpanded: boolean = false;
  GraphicEmp: any;
  bundleEmp: any;
  sales: any;
  transferName: any;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private renderer: Renderer2, private toastr: ToastrService) {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      this.transferName = this.tok.signupUsername;
      if (!this.tok) {
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
    this.auth.salesAllProjects().subscribe((list: any) => {
      this.data = list.map((entry: any) => ({
        ...entry,
        showSub: false
      }));
    });
    this.auth.salesPreviousMonthProjects().subscribe((list: any) => {
      this.dataPreviousMonth = list.map((entry: any) => ({
        ...entry,
        showSub: false
      }));
    });
    this.auth.salesPreviousTwoMonthProjects().subscribe((list: any) => {
      this.dataTwoPreviousMonth = list.map((entry: any) => ({
        ...entry,
        showSub: false
      }));
    });
    this.auth.allEmployee().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.GraphicEmp = res.filter((emp: any) => emp.signupRole && emp.signupRole.includes('Graphic Designer'));
        this.bundleEmp = res.filter((empB: any) => empB.signupRole && empB.signupRole.includes('Bundle Handler'));
      } else {
        console.error("Unexpected response format:", res);
      }
    });

    this.auth.getSalesTeam().subscribe((res: any) => {
      this.sales = res;
    });

    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();
  }

  ToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
  }

  searchCustomer() {
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobile(mobile).subscribe((customers) => {
      this.customers = customers;
      this.errorMessage = null;
    },
      error => {
        this.customers = [];
        this.errorMessage = error.message;
      });
  }

  downloadFile() {
    this.auth.downloadFile();
  }

  onDate() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.getDatabyRange(startDate, endDate).subscribe((rangeData: any) => {
        this.rangeData = rangeData.rangeTotalData;
      });
    }
  }

  downloadRangeFile() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.downloadRangeFile(startDate, endDate);
    }
  }

  delete(id: any, i: any) {
    console.log(id);
    if (window.confirm("Are you Sure want to Delete?")) {
      this.auth.deleteCust(id).subscribe((res: any) => {
        this.data.splice(i, 1);
      })
    }
  }
  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    window.location.href = url;
  }
  invoice(userId: string) {
    const url = `/salesHome/main-invoice/${userId}`;
    //window.open(url,'_blank');
    window.location.href = url;
  }

  updateDesigner(user: any, designer: any) {
    user.graphicPassDate = new Date().toISOString();
    this.auth.updateEditors([user]).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Project ${user.custName} Assigned to ${designer}`, 'Success');
      } else {
        this.toastr.error('Project Assigned Failed', 'Error');
      }
    });
  };
  updatePriority(user: any, priority: any) {
    this.auth.updateEditors([user]).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Project ${user.custName} Priority Set to ${priority}`, 'Success');
      }
    });
  };
  updateStatus(user: any, graphicStatus: any) {
    this.auth.updateEditors([user]).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Project ${user.custName} Status changed to ${graphicStatus}`, 'Success');
      }
    })
  }
  updateSub(user: any, sub: any) {
    const closing = sub.closingPrice ? Number(sub.closingPrice) : 0;
    const adv = sub.advPay ? Number(sub.advPay) : 0;

    // Remaining amount calculate karo
    sub.remainingAmount = closing - adv;
    if (sub.restAmount > 0) {
      const rest = sub.restAmount ? Number(sub.restAmount) : 0;
      sub.remainingAmount = closing - adv - rest;
    }
    this.auth.updateSubEntry(user._id, sub).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Project ${sub.custName} Amount Updated`, 'Success');
      }
    })
  }
  updateBundle(user: any, bundleHandler: any) {
    const currentDate = new Date().toISOString().split('T')[0];
    user.bundlePassDate = currentDate;
    user.bundleStatus = "Not Created";
    this.auth.updateEditors([user]).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Bundle ${user.custName} Assigned to ${bundleHandler}`, 'Success');
      } else {
        this.toastr.error('Bundle Assigned Failed', 'Error');
      }
    });
    let msgTitle = 'Project Bundle Assigned';
    let msgBody = `Bundle ${user.custName} Assigned`;

    this.auth.sendNotifications([bundleHandler], [user], msgTitle, msgBody, currentDate).subscribe((res: any) => {
      if (res) {
        this.toastr.success('Notification Send', 'Success');
      } else {
        this.toastr.error('Error Sending Notification', 'Error');
      }
    })
  };
  transferLead(user: any, newSalesTeam: any) {
    const currentDate = new Date().toISOString();
    const transferData = {
      custId: user._id,
      salesTeam: newSalesTeam,
      closingDate: currentDate,
      name: this.transferName
    };
    this.auth.transferCustomertoSales(transferData).subscribe((res: any) => {
      this.toastr.success("Transferred successfully", "Success");
    });
  }

}
