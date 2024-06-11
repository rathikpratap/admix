import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import { ActivatedRoute} from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-main-invoice',
  templateUrl: './main-invoice.component.html',
  styleUrls: ['./main-invoice.component.css']
})
export class MainInvoiceComponent implements OnInit {

  tok:any;
  getId:any;
  priceOfVideo:any;
  name:any;
  number:any;
  numOfVideos: any;
  gstAmount:any;
  amount: number = 0;
  totalAmount:any;
  wordsAmt:any;
  categ:any;
  currentDate:any;
  Bill:any;
  count:any;

  invoiceForm = new FormGroup({
    billType: new FormControl("null"),
    invoiceCateg: new FormControl("null"),
    custName: new FormControl(""),
    invoiceDate: new FormControl(""),
    numOfVideos: new FormControl(1),
    priceOfVideos: new FormControl(0),
    GSTAmount: new FormControl(0),
    totalAmount: new FormControl(0),
    custNumb: new FormControl(""),
    billFormat: new FormControl(""),
    billNumber: new FormControl()
  })

  ngOnInit(): void {
    this.invoiceForm.get('numOfVideos')?.valueChanges.subscribe(value => {
      this.calculateAmount();
    });
    const date = new Date();
    this.currentDate = this.formatDate(date);
    this.invoiceForm.get('billType')?.valueChanges.subscribe(value=>{
      this.Bill = this.invoiceForm.get('billType')?.value;
      this.calculateAmount();
    });
    
  }

  calculateAmount(): void {

    this.numOfVideos = this.invoiceForm.get('numOfVideos')?.value ?? 0;
      this.amount = this.numOfVideos * this.priceOfVideo;
      if(this.Bill === 'GST'){
        this.gstAmount = this.amount*0.18;
      }else{
        this.gstAmount = 0;
      }
      this.totalAmount = this.amount + this.gstAmount;
      this.wordsAmt = numWords(this.totalAmount);
  }
  
  constructor(private auth:AuthService,private activatedRoute: ActivatedRoute){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data.salesTeam;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });

    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res:any)=>{
      this.name = res.custName;
      this.number = res.custNumb;
      this.priceOfVideo = res.closingPrice;
      this.categ = res.closingCateg;
    });

    this.auth.mainInvoiceCount().subscribe((res:any)=>{
      this.count = res +1;
      console.log("Count==>", this.count);
    })
  }

  downloadPdf() {
    const invoiceElement = document.getElementById('invoice');

    if (invoiceElement) {
      html2canvas(invoiceElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const fileName = `invoice_${this.name}.pdf`.replace(/\s+/g, '_');  // Replace spaces with underscores
        pdf.save(fileName);
      });
    }
    this.invoiceForm.get('custName')?.setValue(this.name);
    this.invoiceForm.get('invoiceDate')?.setValue(this.currentDate);
    this.invoiceForm.get('GSTAmount')?.setValue(this.gstAmount);
    this.invoiceForm.get('totalAmount')?.setValue(this.totalAmount);
    this.invoiceForm.get('custNumb')?.setValue(this.number);
    this.invoiceForm.get('invoiceCateg')?.setValue(this.categ);
    this.invoiceForm.get('priceOfVideos')?.setValue(this.priceOfVideo);
    this.invoiceForm.get('billFormat')?.setValue('Main');
    this.invoiceForm.get('billNumber')?.setValue(this.count)
    const invoiceData = this.invoiceForm.value;
    this.auth.addEstInvoice(invoiceData).subscribe((res:any)=>{

    })
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
