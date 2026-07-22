import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormGroup,FormControl,FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-lead-report',
  templateUrl: './customer-lead-report.component.html',
  styleUrl: './customer-lead-report.component.css'
})
export class CustomerLeadReportComponent implements OnInit {
  tok:any;
  data: any;
  searchForm: FormGroup;
  customers: any[] = [];
  transferName: any;
  errorMessage: any;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;

  ngOnInit(): void {
    this.auth.getCustomerLeadReport().subscribe((res:any) => {
      console.log("ITS RUNNING NOW");
      this.data = res.data;
      console.log("RUNNING DATA===>>", this.data);
    })
  }

  constructor(private auth: AuthService, private formBuilder: FormBuilder,private toastr: ToastrService){
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      this.transferName = this.tok.signupUsername;
      if(!this.tok){
        alert("Session Expired, Please login Again");
        this.auth.logout();
      }
    });
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
  }

  searchCustomer(){
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
  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if(startDate && endDate) {
      this.auth.getCustomerLeadReportRange(startDate, endDate).subscribe((res: any) => {
        this.rangeData = res.data;
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
}
