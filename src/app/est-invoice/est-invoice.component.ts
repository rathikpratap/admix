import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import { ActivatedRoute} from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-est-invoice',
  templateUrl: './est-invoice.component.html',
  styleUrls: ['./est-invoice.component.css']
})
export class EstInvoiceComponent implements OnInit {
  
  tok:any;
  getId:any;
  Category:any;
  numOfVideo:any;
  priceOfVideo:any;
  name:any;
  number:any;
  data:any;
  gstAmount:any;
  amount: number = 0;
  totalAmount:any;
  wordsAmt:any;
  categ:any;
  customCateg:any;
  currentDate:any;
  Bill:any;
  count:any;
  date:any;

  invoiceForm = new FormGroup({
    billType: new FormControl("null"),
    invoiceCateg: new FormControl("null"),
    customCateg: new FormControl(""),
    custName: new FormControl(""),
    billFormat: new FormControl(""),
    invoiceDate: new FormControl(),
    numOfVideos: new FormControl(0),
    priceOfVideos: new FormControl(0),
    GSTAmount: new FormControl(0),
    totalAmount: new FormControl(0),
    custNumb: new FormControl(""),
    billNumber: new FormControl()
  })

  ngOnInit(): void {

    this.invoiceForm.get('priceOfVideos')?.valueChanges.subscribe(value => {
      this.calculateAmount();
      // alert("Please Select Bill Type");
    });

    this.invoiceForm.get('numOfVideos')?.valueChanges.subscribe(value => {
      this.calculateAmount();
    });
    this.invoiceForm.get('invoiceCateg')?.valueChanges.subscribe(value=>{
      this.categ=this.invoiceForm.get('invoiceCateg')?.value;
    });
    this.invoiceForm.get('customCateg')?.valueChanges.subscribe(value=>{
      this.customCateg=this.invoiceForm.get('customCateg')?.value;
    });
    this.date = new Date();
    this.currentDate = this.formatDate(this.date);
    this.invoiceForm.get('billType')?.valueChanges.subscribe(value=>{
      this.Bill = this.invoiceForm.get('billType')?.value;
    });
    
  }

  calculateAmount(): void {
    const gst = this.invoiceForm.get('numOfVideos')?.value ?? 0;
    const price = this.invoiceForm.get('priceOfVideos')?.value ?? 0;

      this.amount = gst * price;
      console.log('Amount:', this.amount);
      if(this.Bill === 'GST'){
        this.gstAmount = this.amount*0.18;
      console.log("18%===>", this.amount*0.18);
      }else{
        this.gstAmount = 0;
        console.log("18%===>", this.gstAmount);
      }
      
      this.totalAmount = this.amount + this.gstAmount;
      console.log("total===>>", this.totalAmount);
      this.wordsAmt = numWords(this.totalAmount);
      this.numOfVideo = this.invoiceForm.get('numOfVideos')?.value;
  }
  
  constructor(private auth:AuthService,private activatedRoute: ActivatedRoute){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      console.log("USerDAta==>", this.tok)
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.getCategory().subscribe((res:any)=>{
      this.Category = res;
    });

    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res:any)=>{
      this.data = res;
      this.name = this.data.custName;
      this.number = this.data.custNumb;
    });

    this.auth.estInvoiceCount().subscribe((res:any)=>{
      this.count = res+1;
      console.log("Count==>", this.count);
    })
  }

  // addRow() {
  //   this.rows.push({ name: '', numOfVideos: '', priceOfVideos:'',gst:'',amt:'' });
  // }
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
        const fileName = `invoice_${this.name}.pdf`.replace(/\s+/g, '_');  // Replace spaces with underscores
        pdf.save(fileName);
      });
    }
    this.invoiceForm.get('custName')?.setValue(this.name);
    this.invoiceForm.get('invoiceDate')?.setValue(this.date);
    this.invoiceForm.get('GSTAmount')?.setValue(this.gstAmount);
    this.invoiceForm.get('totalAmount')?.setValue(this.totalAmount);
    this.invoiceForm.get('custNumb')?.setValue(this.number);
    this.invoiceForm.get('billFormat')?.setValue('Estimate');
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
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  onSpanInput(event: Event): void {
    const inputText = (event.target as HTMLSpanElement).innerText;
    this.invoiceForm.get('customCateg')?.setValue(inputText);
  }
}
