import { Component } from '@angular/core';
import { AuthService} from '../service/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './download-invoice.component.html',
  styleUrl: './download-invoice.component.css'
})
export class DownloadInvoiceComponent {

  tok:any;
  invoiceData: any;
  quotationData: any;
  nonGST: any;
  searchForm: FormGroup;
  customers :any[] = [];  
  errorMessage: any;
  data:any=[];

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });

  constructor(private auth: AuthService,private formBuilder: FormBuilder){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
    this.auth.getInvoice().subscribe((res:any)=>{
      this.invoiceData = res.invoiceData;
      this.quotationData = res.quotationData;
      this.nonGST = res.nonGSTData;
    });
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getInvoiceRange(startDate, endDate).subscribe((res:any)=>{
        this.invoiceData = res.invoiceData;
        this.quotationData = res.quotationData;
        this.nonGST = res.nonGSTData;
      }) 
    }
  }; 

  openViewPanel(userId: string){
    const url = `/salesHome/viewInvoice/${userId}`;
    window.location.href = url;
  }
  searchCustomer(){
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchInvoice(mobile).subscribe((customers)=>{
      this.customers = customers;
      this.errorMessage = null;
      console.log("INVOICE YES=======>>", this.customers);
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }

  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteEst(id).subscribe((res : any)=>{
        this.data.splice(i,1);
      })
    }
  }
}
