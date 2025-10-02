import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-main-invoice',
  templateUrl: './main-invoice.component.html',
  styleUrls: ['./main-invoice.component.css']
})
export class MainInvoiceComponent implements OnInit {

  tok: any;
  getId: any;
  Category: any;
  name: string = '';
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
  countNonGST: any;
  date: any;
  totalGstAmount: number = 0;
  totalNumOfVideoss: number = 0;
  totalGSTT: any;
  grandTotalAmountt: any;
  QrCheck: any;
  // state: string = '';
  financialYear: any;
  billFormat: any;
  afterDiscountTotal: number = 0;
  isGeneratingPdf = false;

  invoiceForm = new FormGroup({
    billType: new FormControl("GST"),
    gstType: new FormControl(""),
    invoiceCateg: new FormControl("null"),
    customCateg: new FormControl(""),
    billFormat: new FormControl(""),
    invoiceDate: new FormControl(),
    totalAmount: new FormControl(0),
    GSTAmount: new FormControl(0),
    billNumber: new FormControl(),
    discountValue: new FormControl(0),
    state: new FormControl(''),
    rows: this.fb.array([]),
    invoiceNumb: new FormControl('')
  });
  custForm = new FormGroup({
    custName: new FormControl(""),
    custNumb: new FormControl(),
    custGST: new FormControl(""),
    custAddLine1: new FormControl(""),
    custAddLine2: new FormControl(""),
    custAddLine3: new FormControl("")
  });

  ngOnInit(): void {
    this.date = new Date();
    this.currentDate = this.formatDate(this.date);
    this.financialYear = this.getFinancialYear(this.date);
    // Convert to a string that works with input[type="date"]
    const isoDate = this.date.toISOString().substring(0, 10); // 'YYYY-MM-DD'
    // 👇 Set the form control value
    this.invoiceForm.get('invoiceDate')?.setValue(isoDate);

    console.log("TODAY DATE=============>>", this.invoiceForm.get('invoiceDate'));

    this.invoiceForm.get('billType')?.valueChanges.subscribe(() => {
      this.updateBillFormat();
    });

    this.custForm.get('custGST')?.valueChanges.subscribe(() => {
      this.updateBillFormat();
    });

    this.invoiceForm.get('discountValue')?.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.getCategory().subscribe((res: any) => {
      this.Category = res;
    });
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    this.auth.getCustomer(this.getId).subscribe((res: any) => {
      this.name = res.custName;
      this.number = res.custNumb;
      this.QrCheck = res.Qr;
      const state = res.custState;
      console.log("STATE=======>>", state);
      this.invoiceForm.get('state')?.setValue(state);
      if (state === 'UP') {
        this.invoiceForm.get('gstType')?.setValue('UP');
      } else {
        this.invoiceForm.get('gstType')?.setValue('Other');
      }
      this.custForm.patchValue({
        custName: this.name,
        custNumb: this.number
      });

      // ✅ Run this immediately after customer is loaded and form is initialized
      const initialBill = this.invoiceForm.get('billType')?.value;
      if (initialBill === 'GST' && this.QrCheck !== 'Admix Media') {
        Swal.fire({
          title: 'Customer QR not selected as Admix Media',
          text: 'Continue as Non-GST Invoice',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'No, Cancel'
        }).then(result => {
          if (result.isConfirmed) {
            this.invoiceForm.get('billType')?.setValue('Non-GST');
          } else {
            this.location.back();
          }
        });
      }

      this.invoiceForm.get('billType')?.valueChanges.subscribe(value => {
        this.Bill = value;
        if (this.Bill === 'GST' && this.QrCheck !== 'Admix Media') {
          Swal.fire({
            title: 'Customer QR not selected as Admix Media',
            text: 'Continue as Non-GST Invoice',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Continue',
            cancelButtonText: 'No, Cancel'
          }).then((result) => {
            if (result.isConfirmed) {
              this.invoiceForm.get('billType')?.setValue('Non-GST');
            } else {
              this.location.back();
            }
          });
        }
        this.calculateGrandTotal();
      });
    });

    this.auth.mainInvoiceCount(this.financialYear).subscribe((res: any) => {
      this.count = res.invoiceStart ?? 1;
      this.countNonGST = res.nonGSTStart ?? 1;
    });

    this.addRow();
  }
  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService, private location: Location, private cd: ChangeDetectorRef) { }
  get rows() {
    return this.invoiceForm.get('rows') as FormArray;
  }
  addRow() {
    const row = this.fb.group({
      invoiceCateg: [''],
      customCateg: [''],
      numOfVideos: [0],
      priceOfVideos: [0],
      gst: [{ value: 0, disabled: true }],
      amt: [{ value: 0, disabled: true }]
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

    row.get('amt')?.setValue(parseFloat(totalAmount.toFixed(2)));
    row.get('gst')?.setValue(parseFloat(gst.toFixed(2)));
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

      // if (this.invoiceForm.get('billType')?.value === 'GST') {
      //   totalGst += gst;
      // }
    });

    const discountValue = Number(this.invoiceForm.get('discountValue')?.value || 0);

    this.totalAmount = Math.round(totalAmount);
    this.afterDiscountTotal = Math.round(this.totalAmount - discountValue);
    //this.afterDiscountTotal = Math.round(this.afterDiscountTotal);

    this.gstAmount = this.invoiceForm.get('billType')?.value === 'GST' ? totalGst : 0;
    this.totalNumOfVideoss = Math.round(totalNumOfVideos);

    // Amount before GST (net amount)
    this.amount = parseFloat((this.totalAmount - this.gstAmount).toFixed(2));

    try {
      this.wordsAmt = numWords(this.totalAmount || 0);
    } catch (error) {
      console.error('Error converting number to words:', error);
      this.wordsAmt = 'Error';
    }
  }

  updateBillFormat(): void {
    const billType = this.invoiceForm.get('billType')?.value;
    const custGST = this.custForm.get('custGST')?.value;
    this.billFormat = (billType === 'GST' && custGST && custGST.trim() !== '') ? 'Main' : 'Non-GST';
    this.invoiceForm.get('billFormat')?.setValue(this.billFormat);
  }
  setDefaultDate() {
    const control = this.invoiceForm.get('invoiceDate');
    if (!control?.value) {
      const today = new Date().toISOString().substring(0, 10);
      control?.setValue(today);
    }
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
    let invoiceNumb = '';

    if (this.invoiceForm.get('billFormat')?.value === 'Main' && this.invoiceForm.get('billType')?.value === 'GST') {
      invoiceNumb = `ADMIX-${this.financialYear}/${this.count}`;
    } else {
      invoiceNumb = `ADM-${this.financialYear}/${this.countNonGST}`;
    }

    // this.invoiceForm.get('invoiceDate')?.setValue(this.date);
    this.invoiceForm.get('GSTAmount')?.setValue(this.gstAmount || 0);
    this.invoiceForm.get('totalAmount')?.setValue(this.totalAmount || 0);

    // this.invoiceForm.get('billNumber')?.setValue(110+this.count);
    if (this.billFormat === 'Main') {
      this.invoiceForm.get('billNumber')?.setValue(this.count);
    } else {
      this.invoiceForm.get('billNumber')?.setValue(this.countNonGST);
    }

    this.invoiceForm.get('rows')?.setValue(rowsData);
    this.invoiceForm.get('invoiceNumb')?.setValue(invoiceNumb);

    const invoiceData = this.invoiceForm.value;
    const custData = this.custForm.value;
    const combinedData = { ...custData, ...invoiceData, financialYear: this.financialYear, customerId: this.getId };

    // this.auth.addEstInvoice(combinedData).subscribe((res: any) => {
    //   if (res.success) {
    //     this.toastr.success('Invoice saved Successfully', 'Success');
    //     this.generatePdf();
    //   } else if (res.dataExists) {
    //     Swal.fire({
    //       title: 'Invoice Already Exists',
    //       text: res.message,
    //       icon: 'warning',
    //       showCancelButton: true,
    //       confirmButtonText: 'Yes, Update it',
    //       cancelButtonText: 'No, Cancel'
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         this.auth.addEstInvoice({ ...combinedData, allowUpdate: true }).subscribe((res: any) => {
    //           if (res.success) {
    //             this.toastr.success('New Invoice Saved Successfully', 'Success');
    //             this.generatePdf();
    //           } else {
    //             this.toastr.error('Error Saving Invoice', 'Error');
    //           }
    //         });
    //       } else {
    //         this.toastr.error('Update Cancelled', 'Info');
    //       }
    //     });
    //   } else {
    //     this.toastr.error('Error Saving New Invoice', 'Error');
    //   }
    // });

    this.auth.addEstInvoice(combinedData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Invoice saved successfully', 'Success');
        this.generatePdf();
      } else if (res.sameDateExists) {
        Swal.fire({
          title: 'Invoice Exists on Same Date',
          text: res.message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Update it',
          cancelButtonText: 'No, Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.auth.addEstInvoice({ ...combinedData, allowUpdate: true }).subscribe((res: any) => {
              if (res.success) {
                this.toastr.success('Invoice Updated Successfully', 'Success');
                this.generatePdf();
              } else {
                this.toastr.error('Update Failed', 'Error');
              }
            });
          }
        });
      } else if (res.differentDateExists) {
        Swal.fire({
          title: 'Invoice Already Exists This Month',
          text: res.message,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Yes, Save New Entry',
          cancelButtonText: 'No, Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.auth.addEstInvoice({ ...combinedData, allowNewDateEntry: true }).subscribe((res: any) => {
              if (res.success) {
                this.toastr.success('New Invoice Saved Successfully', 'Success');
                this.generatePdf();
              } else {
                this.toastr.error('Failed to Save New Invoice', 'Error');
              }
            });
          }
        });
      } else {
        this.toastr.error('Unknown error occurred', 'Error');
      }
    });

  }
  // generatePdf() {
  //   const invoiceElement = document.getElementById('invoice');
  //   if (invoiceElement) {
  //     html2canvas(invoiceElement).then(canvas => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF({
  //         orientation: 'p',
  //         unit: 'mm',
  //         format: [210 * 1.5, 297 * 1.5]
  //       });
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //       const fileName = `invoice_${this.name}.pdf`.replace(/\s+/g, '_');
  //       pdf.save(fileName);
  //     });
  //   }
  // }

  //   generatePdf() { 
  //   this.isGeneratingPdf = true;
  //   this.cd.detectChanges();

  //   setTimeout(() => {
  //     const invoiceElement = document.getElementById('invoice');
  //     if (invoiceElement) {
  //       html2canvas(invoiceElement).then(canvas => {
  //         const imgData = canvas.toDataURL('image/png');
  //         const pdf = new jsPDF({
  //           orientation: 'p',
  //           unit: 'mm',
  //           format: [210 * 1.5, 297 * 1.5]
  //         });

  //         const imgProps = pdf.getImageProperties(imgData);
  //         const pdfWidth = pdf.internal.pageSize.getWidth();
  //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //         pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  //         const fileName = `invoice_${this.name || 'export'}.pdf`.replace(/\s+/g, '_');
  //         pdf.save(fileName);

  //         this.isGeneratingPdf = false;
  //         this.cd.detectChanges();
  //       });
  //     }
  //   }, 100); // slight delay to ensure DOM updates
  // }

  generatePdf() {
    const invoiceElement = document.getElementById('invoice');
    if (!invoiceElement) return;

    // --- Optional: temporarily add top/bottom padding for PDF only (keeps on-screen same if you revert after) ---
    // If you already have CSS padding in #invoice, you can skip this block.
    const addPdfPadding = true;
    let prevPaddingTop = '';
    let prevPaddingBottom = '';
    if (addPdfPadding) {
      prevPaddingTop = invoiceElement.style.paddingTop || '';
      prevPaddingBottom = invoiceElement.style.paddingBottom || '';
      invoiceElement.style.paddingTop = '15px';   // top padding for each page (adjust if needed)
      invoiceElement.style.paddingBottom = '15px';// bottom padding for each page
      invoiceElement.style.boxSizing = 'border-box';
    }

    // compute exact on-screen pixel dimensions to preserve visual size
    const elementWidthPx = Math.ceil(invoiceElement.scrollWidth);
    const elementHeightPx = Math.ceil(invoiceElement.scrollHeight);

    // html2pdf options:
    const opt: any = {
      margin: 0, // keep 0 because we add padding inside the element (or set numeric/tuple if preferred)
      filename: `invoice_${this.name || 'invoice'}.pdf`.replace(/\s+/g, '_'),
      image: { type: 'png', quality: 1.0 },
      html2canvas: {
        scale: 1,          // 1 => preserve on-screen pixel sizes exactly (no upscaling)
        useCORS: true,
        logging: false,
        width: elementWidthPx,
        height: elementHeightPx,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight
      },
      jsPDF: {
        unit: 'px',                      // use pixels so sizes match the canvas exactly
        format: [elementWidthPx, elementHeightPx],
        orientation: 'p'
      },
      pagebreak: { mode: ['css', 'legacy'] } // allow CSS page-break rules
    };

    // run html2pdf (returns a Promise)
    html2pdf().set(opt).from(invoiceElement).save()
      .then(() => {
        // restore padding changes
        if (addPdfPadding) {
          invoiceElement.style.paddingTop = prevPaddingTop;
          invoiceElement.style.paddingBottom = prevPaddingBottom;
        }
      })
      .catch((err: any) => {
        console.error('html2pdf error:', err);
        // restore padding if any
        if (addPdfPadding) {
          invoiceElement.style.paddingTop = prevPaddingTop;
          invoiceElement.style.paddingBottom = prevPaddingBottom;
        }
      });
  }



  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  getFinancialYear(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (month >= 4) {
      return `${(year).toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${(year - 1).toString().slice(-2)}-${(year).toString().slice(-2)}`;
    }
  }
  get invoiceDateControl(): FormControl {
    return this.invoiceForm.get('invoiceDate') as FormControl;
  }
  // getFormattedInvoiceDate(): string {
  //   const rawDate = this.invoiceForm.get('invoiceDate')?.value;

  //   if (!rawDate) return '';

  //   if (typeof rawDate === 'string') {
  //     // already in 'YYYY-MM-DD'
  //     const [year, month, day] = rawDate.split('-');
  //     return `${day}-${month}-${year}`;
  //   }

  //   if (rawDate instanceof Date) {
  //     // convert date object to formatted string
  //     return this.formatDate(rawDate);
  //   }

  //   return '';
  // }
  getFormattedInvoiceDate(): string {
    const rawDate = this.invoiceForm.get('invoiceDate')?.value;

    // Handle Date object or string
    let dateObj: Date;
    if (!rawDate) return '';

    if (typeof rawDate === 'string') {
      // 'YYYY-MM-DD' format
      dateObj = new Date(rawDate);
    } else if (rawDate instanceof Date) {
      dateObj = rawDate;
    } else {
      return ''; // unknown format
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`; // or use your preferred format
  }

  isModelAvailabilityVisible(): boolean {
    // Agar koi row in categories me se select kare to Model Availability wala li HIDE karna hai
    const hideCategories = ['Logo Design', 'Website Development', 'Graphic Designing', 'Voice Over', 'Logo Animation', 'Ad Run'];

    // rows FormArray ko read karke check karte hain
    const formArray = this.rows; // getter already defined in your class
    for (let i = 0; i < formArray.length; i++) {
      const grp = formArray.at(i) as FormGroup;
      const val = (grp.get('invoiceCateg')?.value || '').toString();
      // agar value exactly match kare to hide kar do (case-sensitive)
      if (hideCategories.includes(val)) {
        return false; // don't show the Model Availability li
      }

      // optional: agar invoiceCateg === 'Other' aur customCateg me user ne same text dala ho
      if (val === 'Other') {
        const custom = (grp.get('customCateg')?.value || '').toString();
        if (hideCategories.includes(custom)) {
          return false;
        }
      }
    }

    return true; // default: show the li
  }
  isAdvertisementVideoVisible(): boolean {
    // Agar koi row in categories me se select kare to Model Availability wala li HIDE karna hai
    const hideCategories = ['Advertisement Video','Other'];

    // rows FormArray ko read karke check karte hain
    const formArray = this.rows; // getter already defined in your class
    for (let i = 0; i < formArray.length; i++) {
      const grp = formArray.at(i) as FormGroup;
      const val = (grp.get('invoiceCateg')?.value || '').toString();
      // agar value exactly match kare to hide kar do (case-sensitive)
      if (hideCategories.includes(val)) {
        return false; // don't show the Model Availability li
      }

      // optional: agar invoiceCateg === 'Other' aur customCateg me user ne same text dala ho
      if (val === 'Other') {
        const custom = (grp.get('customCateg')?.value || '').toString();
        if (hideCategories.includes(custom)) {
          return false;
        }
      }
    }

    return true; // default: show the li
  }

} 
