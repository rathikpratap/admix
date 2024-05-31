import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vo-payroll',
  templateUrl: './vo-payroll.component.html',
  styleUrls: ['./vo-payroll.component.css']
})
export class VoPayrollComponent {
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
    this.auth.payrollDataVo().subscribe((res:any)=>{
      this.data = res;
    })
  }
  searchPayment(){
    const voCNR = this.searchForm.get('VoCNR')!.value;
    console.log("CNR===>", voCNR);
    this.auth.searchPaymentVo(voCNR).subscribe((customers:any)=>{
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
      this.auth.getPayrollbyDatePassRangeVo(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData);
        this.rangeData = rangeData;
      })
    }
  }
}
