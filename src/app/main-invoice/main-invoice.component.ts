import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import { ActivatedRoute} from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-invoice',
  templateUrl: './main-invoice.component.html',
  styleUrls: ['./main-invoice.component.css']
})
export class MainInvoiceComponent implements OnInit {

  tok: any;
  getId: any;
  Category: any;
  name: string ='';
  number: any;
  data: any;
  gstAmount: any;
  amount: number = 0;
  totalAmount: number = 0;
  wordsAmt: any;
  categ: any;
  customCateg: any;
  currentDate: any;
  Bill: any;
  count: any;
  date: any;
  totalGstAmount: number = 0;
  totalNumOfVideoss: number = 0;
  totalGSTT: any;
  grandTotalAmountt: any;

  invoiceForm = new FormGroup({
    billType: new FormControl("null"),
    gstType: new FormControl("null"),
    invoiceCateg: new FormControl("null"),
    customCateg: new FormControl(""),
    billFormat: new FormControl(""),
    invoiceDate: new FormControl(),
    totalAmount: new FormControl(0),
    GSTAmount: new FormControl(0),
    billNumber: new FormControl(),
    rows: this.fb.array([]),
  });
  custForm = new FormGroup({
    custName: new FormControl(""),
    custNumb: new FormControl(),
    custGST: new FormControl(""),
    custAddLine1: new FormControl(""),
    custAddLine2: new FormControl(""),
    custAddLine3: new FormControl("")
  })

  ngOnInit(): void {
    // this.invoiceForm.get('numOfVideos')?.valueChanges.subscribe(value => {
    //   this.calculateAmount();
    // });
    this.date = new Date();
    this.currentDate = this.formatDate(this.date);
    this.invoiceForm.get('billType')?.valueChanges.subscribe(value=>{
      this.Bill = value;
      this.calculateGrandTotal();
    });

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.getCategory().subscribe((res: any) => {
      this.Category = res;
    });
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    this.auth.getCustomer(this.getId).subscribe((res:any)=>{
      this.name = res.custName;
      this.number = res.custNumb;
      this.custForm.patchValue({
        custName: this.name,
        custNumb: this.number
      });
      // this.priceOfVideo = res.closingPrice;
      // this.categ = res.closingCateg;
    });

    this.auth.mainInvoiceCount().subscribe((res:any)=>{
      this.count = (res??0) + 1;
      console.log("Count==>", this.count);
    });
    this.addRow();
    
  }

  // calculateAmount(): void {

  //   this.numOfVideos = this.invoiceForm.get('numOfVideos')?.value ?? 0;
  //     this.amount = this.numOfVideos * this.priceOfVideo;
  //     if(this.Bill === 'GST'){
  //       this.gstAmount = this.amount*0.18;
  //     }else{
  //       this.gstAmount = 0;
  //     }
  //     this.totalAmount = this.amount + this.gstAmount;
  //     this.wordsAmt = numWords(this.totalAmount);
  // }
  
  constructor(private auth:AuthService,private activatedRoute: ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService){ }

  get rows() {
    return this.invoiceForm.get('rows') as FormArray;
  }

  addRow() {
    const row = this.fb.group({
      invoiceCateg: [''],
      customCateg:[''],
      numOfVideos: [0],
      priceOfVideos: [0],
      gst: [{value: 0, disabled: true}],
      amt: [{value: 0, disabled: true}]
    });
    this.rows.push(row);

    row.get('numOfVideos')?.valueChanges.subscribe(() => {
      this.calculateRowAmount(row);
    });
    row.get('priceOfVideos')?.valueChanges.subscribe(() => {
      this.calculateRowAmount(row);
    });
  }

  calculateRowAmount(row: FormGroup): void {
    const numOfVideos = Number(row.get('numOfVideos')?.value) || 0;
    const priceOfVideos = Number(row.get('priceOfVideos')?.value) || 0;
    const amount = numOfVideos * priceOfVideos;
    let gst = 0;

    if (this.Bill === 'GST') {
      gst = amount * 0.18;
    }

    const totalAmount = amount + gst;

    row.get('amt')?.setValue(totalAmount);
    //row.get('amt')?.setValue(totalAmount.toFixed(2));
    row.get('gst')?.setValue(parseFloat(gst.toFixed(2)));
    //row.get('gst')?.setValue(gst);

    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    let totalAmount = 0;
    let totalGst = 0;
    let totalNumOfVideos = 0;

    this.rows.controls.forEach(row => {
      const amt = row.get('amt')?.value ?? 0;
      const gst = row.get('gst')?.value ?? 0;
      const numOfVideos = row.get('numOfVideos')?.value ?? 0;

      totalAmount += amt;
      totalGst += gst;
      totalNumOfVideos += numOfVideos;
    });
    this.totalAmount = Math.round(totalAmount);
  this.gstAmount = totalGst;
  this.totalNumOfVideoss = Math.round(totalNumOfVideos);
  this.amount = parseFloat((this.totalAmount - this.gstAmount).toFixed(2));
    console.log('Total Amount:', this.totalAmount); // Debug log
  console.log('GST Amount:', this.gstAmount); // Debug log
    //this.wordsAmt = numWords(this.totalAmount || 0);
    //this.totalNumOfVideoss = totalNumOfVideos;

    try {
      this.wordsAmt = numWords(this.totalAmount || 0);
    } catch (error) {
      console.error('Error converting number to words:', error);
      this.wordsAmt = 'Error';
    }
  }
  
  // downloadPdf() {
  //   const invoiceElement = document.getElementById('invoice');

  //   if (invoiceElement) {
  //     html2canvas(invoiceElement).then(canvas => {
  //       const imgData = canvas.toDataURL('image/png');
  //       //const pdf = new jsPDF('p', 'mm', 'a4');
  //       const pdf = new jsPDF({
  //         orientation: 'p', 
  //         unit: 'mm', 
  //         format: [210 * 1.5, 297 * 1.5]  // A4 size increased by 1.5 times
  //       });
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //       // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //       const fileName = `invoice_${this.name}.pdf`.replace(/\s+/g, '_');  // Replace spaces with underscores
  //       pdf.save(fileName);
  //     });
  //   }

  //   const rowsData = this.rows.controls.map(row => {
  //     return {
  //       invoiceCateg: row.get('invoiceCateg')?.value || '',
  //       customCateg: row.get('customCateg')?.value || '',
  //       numOfVideos: row.get('numOfVideos')?.value || 0,
  //       priceOfVideos: row.get('priceOfVideos')?.value || 0,
  //       gst: row.get('gst')?.value || 0,
  //       amt: row.get('amt')?.value || 0
  //     };
  //   });

  //   //this.invoiceForm.get('custName')?.setValue(this.name);
  //   this.invoiceForm.get('invoiceDate')?.setValue(this.date);
  //   this.invoiceForm.get('GSTAmount')?.setValue(this.gstAmount);
  //   this.invoiceForm.get('totalAmount')?.setValue(this.totalAmount);
  //   //this.invoiceForm.get('custNumb')?.setValue(this.number);
  //   this.invoiceForm.get('billFormat')?.setValue('Main');
  //   this.invoiceForm.get('billNumber')?.setValue(this.count);
  //   this.invoiceForm.get('rows')?.setValue(rowsData);
  //   const invoiceData = this.invoiceForm.value;
  //   const custData = this.custForm.value;
  //   const combinedData = {...custData, ...invoiceData};
  //   this.auth.addEstInvoice(combinedData).subscribe((res:any)=>{
  //     if(res.success){
  //       alert('Invoice saved successfully');
  //     }else{
  //       alert('error saving invoice');
  //     }
  //   });
  // }

  downloadPdf(){
    const rowsData = this.rows.controls.map(row => {
      return {
        invoiceCateg:row.get('invoiceCateg')?.value || '',
        customCateg: row.get('customCateg')?.value || '',
        numOfVideos: row.get('numOfVideos')?.value || 0,
        priceOfVideos: row.get('priceOfVideos')?.value || 0,
        get: row.get('gst')?.value || 0,
        amt: row.get('amt')?.value || 0
      };
    });
    this.invoiceForm.get('invoiceDate')?.setValue(this.date);
    this.invoiceForm.get('GSTAmount')?.setValue(this.gstAmount || 0);
    this.invoiceForm.get('totalAmount')?.setValue(this.totalAmount || 0);
    this.invoiceForm.get('billFormat')?.setValue('Main');
    this.invoiceForm.get('billNumber')?.setValue(this.count);
    this.invoiceForm.get('rows')?.setValue(rowsData);

    const invoiceData = this.invoiceForm.value;
    const custData = this.custForm.value;
    const combinedData = { ...custData, ...invoiceData};

    this.auth.addEstInvoice(combinedData).subscribe((res:any)=>{
      if(res.success){
        this.toastr.success('Invoice saved Successfully','Success');
        this.generatePdf();
      }else if(res.dataExists){
        const userConfirmed = confirm(res.message);
        if(userConfirmed){
          this.auth.addEstInvoice({ ...combinedData, allowDuplicate: true}).subscribe((res: any)=>{
            if(res.success){
              this.toastr.success('New Invoice Saved Successfully','Success');
              this.generatePdf();
            }else{
              this.toastr.error('Error Saving Invoice','Error');
            }
          });
        }
      }else{
        this.toastr.error('Error Saving New Invoice','Error');
      }
    });
  }
  generatePdf(){
    const invoiceElement = document.getElementById('invoice');
    if(invoiceElement){
      html2canvas(invoiceElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: [210 * 1.5, 297 * 1.5]
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const fileName = `invoice_${this.name}.pdf`.replace(/\s+/g, '_');
        pdf.save(fileName);
      });
    }
  }
  
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
