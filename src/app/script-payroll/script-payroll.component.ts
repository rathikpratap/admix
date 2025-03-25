import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-script-payroll',
  templateUrl: './script-payroll.component.html',
  styleUrls: ['./script-payroll.component.css']
})
export class ScriptPayrollComponent {
  tok:any;
  searchForm: FormGroup;
  customers:any[]=[];
  errorMessage: any;
  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;
  data:any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.searchForm = this.formBuilder.group({
      ScriptCNR:['']
    });
    this.auth.payrollDataScript().subscribe((res:any)=>{
      this.data = res;
    })
  }
  searchPayment(){
    const scriptCNR = this.searchForm.get('ScriptCNR')!.value;
    this.auth.searchPaymentScript(scriptCNR).subscribe((customers:any)=>{
      this.customers = customers;
      this.errorMessage = null;
    }, error =>{
      this.customers = [];
      this.errorMessage = error.message;
    })
  }
  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getPayrollbyDatePassRangeScript(startDate, endDate).subscribe((rangeData:any)=>{
        this.rangeData = rangeData;
      })
    }
  }
}