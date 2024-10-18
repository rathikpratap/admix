import { Component } from '@angular/core';
import { AuthService} from '../service/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getInvoice(startDate, endDate).subscribe((res:any)=>{
        this.invoiceData = res;
        console.log("INVOICE=======>>", this.invoiceData);
      })
    }
  };

  openViewPanel(userId: string){
    const url = `/viewInvoice/${userId}`;
    window.location.href = url;
  }

}
