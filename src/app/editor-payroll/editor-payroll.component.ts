import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor-payroll',
  templateUrl: './editor-payroll.component.html',
  styleUrls: ['./editor-payroll.component.css']
})
export class EditorPayrollComponent {
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
      EditorCNR:['']
    });
    this.auth.payrollData().subscribe((res:any)=>{
      this.data = res;
    })
  }
  searchPayment(){
    const editorCNR = this.searchForm.get('EditorCNR')!.value;
    console.log("CNR===>", editorCNR);
    this.auth.searchPayment(editorCNR).subscribe((customers:any)=>{
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
      this.auth.getPayrollbyDatePassRangeEditor(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData);
        this.rangeData = rangeData;
      })
    }
  }
}
