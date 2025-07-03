import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.css'
})
export class ViewInvoiceComponent implements OnInit {

  getId: any;
  invoiceData: any;
  invoiceForm!: FormGroup;
  custForm!: FormGroup;
  amount: number = 0;
  gstAmount: number = 0;
  totalAmount: number = 0;
  wordsAmt: string = '';
  name: any;
  date: any;
  formatType: any;
  financialYear: any;

  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.date = new Date();
    this.invoiceForm = this.fb.group({
      billType: [''],
      gstType: [''],
      GSTAmount: [0],
      totalAmount: [0],
      invoiceDate: [new Date()],
      rows: this.fb.array([])
    });
    this.financialYear = this.getFinancialYear(this.date);

    this.custForm = this.fb.group({
      custName: [''],
      custNumb: [''],
      custGST: [''],
      custAddLine1: [''],
      custAddLine2: [''],
      custAddLine3: ['']
    });

    this.auth.getSelectedInvoice(this.getId).subscribe((res: any) => {
      this.invoiceData = res;
      this.name = res.custName;
      this.formatType = res.billFormat;
      console.log("FORMAT TYPE======>>", this.formatType);

      this.invoiceForm.patchValue({
        billType: res.billType,
        gstType: res.gstType,
      });

      const rows = res.rows || [];
      const rowsFormArray = this.fb.array(
        rows.map((row: any) => {
          const group = this.fb.group({
            invoiceCateg: [row.invoiceCateg || ''],
            customCateg: [row.customCateg || ''],
            numOfVideos: [row.numOfVideos || 0],
            priceOfVideos: [row.priceOfVideos || 0],
            gst: [{ value: 0, disabled: true }],
            amt: [{ value: 0, disabled: true }]
          });
          this.attachValueChangeListeners(group);
          this.calculateRowAmount(group);
          return group;
        })
      );

      this.invoiceForm.setControl('rows', rowsFormArray);

      this.custForm.patchValue({
        custName: res.custName,
        custNumb: res.custNumb,
        custGST: res.custGST,
        custAddLine1: res.custAddLine1,
        custAddLine2: res.custAddLine2,
        custAddLine3: res.custAddLine3
      });
      this.calculateTotals();
    });

    this.invoiceForm.get('billType')?.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  get rows(): FormArray {
    return this.invoiceForm.get('rows') as FormArray;
  }
  convertToNumber(value: any): number {
    return Number(value) || 0;
  }

  get totalNumOfVideoss(): number {
    return this.rows.controls.reduce((total, group) => {
      const value = group.get('numOfVideos')?.value || 0;
      return total + Number(value);
    }, 0);
  }

  addRow(): void {
    const row = this.fb.group({
      invoiceCateg: [''],
      customCateg: [''],
      numOfVideos: [0],
      priceOfVideos: [0],
      gst: [{ value: 0, disabled: true }],
      amt: [{ value: 0, disabled: true }]
    });

    this.attachValueChangeListeners(row);
    this.rows.push(row);
  }

  private attachValueChangeListeners(row: FormGroup): void {
    row.get('numOfVideos')?.valueChanges.subscribe(() => this.calculateRowAmount(row));
    row.get('priceOfVideos')?.valueChanges.subscribe(() => this.calculateRowAmount(row));
  }

  private calculateRowAmount(row: FormGroup): void {
    const num = +row.get('numOfVideos')?.value || 0;
    const price = +row.get('priceOfVideos')?.value || 0;
    const amount = num * price;
    let gst = 0;

    if (this.invoiceForm.get('billType')?.value === 'GST') {
      gst = amount * 0.18;
    }

    const total = amount + gst;

    row.get('amt')?.setValue(total.toFixed(2), { emitEvent: false });
    row.get('gst')?.setValue(gst.toFixed(2), { emitEvent: false });

    this.calculateTotals();
  }

  calculateTotals(): void {
    this.amount = 0;
    this.gstAmount = 0;

    this.rows.controls.forEach((row: any) => {
      const num = +row.get('numOfVideos')?.value || 0;
      const price = +row.get('priceOfVideos')?.value || 0;
      const rowAmt = num * price;
      this.amount += rowAmt;

      if (this.invoiceForm.get('billType')?.value === 'GST') {
        this.gstAmount += rowAmt * 0.18;
      }
    });

    this.totalAmount = this.amount + this.gstAmount;
    console.log("TOTALAMOUNT TOTALAMOUNT======>>", this.totalAmount);
    const roundedAmount = Math.round(this.totalAmount);
    this.wordsAmt = numWords(roundedAmount).toUpperCase();
    console.log("WORDSAMOUNT =============>>", this.wordsAmt);
  }
  downloadPdf() {
    const rowsData = this.rows.controls.map(row => {
      return {
        invoiceCateg: row.get('invoiceCateg')?.value || '',
        customCateg: row.get('customCateg')?.value || '',
        numOfVideos: row.get('numOfVideos')?.value || 0,
        priceOfVideos: row.get('priceOfVideos')?.value || 0,
        gst: row.get('gst')?.value || 0,
        amt: row.get('amt')?.value || 0
      };
    });
    this.invoiceForm.get('invoiceDate')?.setValue(this.date);
    this.invoiceForm.get('GSTAmount')?.setValue(this.gstAmount || 0);
    this.invoiceForm.get('totalAmount')?.setValue(this.totalAmount || 0);
    this.invoiceForm.get('rows')?.setValue(rowsData);

    const invoiceData = this.invoiceForm.value;
    const custData = this.custForm.value;
    const combinedData = { ...custData, ...invoiceData };

    this.auth.updateInvoice(combinedData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Invoice saved Successfully', 'Success');
        this.generatePdf();
      } else if (res.dataExists) {
        Swal.fire({
          title: 'Are you sure to Update?',
          text: res.message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, update it',
          cancelButtonText: 'No, Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.auth.updateInvoice({ ...combinedData, allowUpdate: true }).subscribe((res: any) => {
              if (res.success) {
                this.toastr.success('New Invoice Save Successfully', 'Success');
                this.generatePdf();
              } else {
                this.toastr.error('Error Saving Invoice', 'Error');
              }
            });
          } else {
            this.toastr.error('Error Saving Invoice', 'Error');
          }
        });
      } else {
        this.toastr.error('Error Saving Invoice', "Error");
      }
    });
  }
  generatePdf() {
    const invoiceElement = document.getElementById('invoice');
    if (invoiceElement) {
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
  getFinancialYear(date: Date): string{
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if(month >=4){
      return `${(year).toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${(year -1).toString().slice(-2)}-${(year).toString().slice(-2)}`;
    }
  }
}