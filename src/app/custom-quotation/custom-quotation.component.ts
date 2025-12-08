import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
//import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-custom-quotation',
  templateUrl: './custom-quotation.component.html',
  styleUrl: './custom-quotation.component.css'
})
export class CustomQuotationComponent implements OnInit {

  tok: any;
  //getId: any;
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
  date: any;
  totalGstAmount: number = 0;
  totalNumOfVideoss: number = 0;
  totalGSTT: any;
  grandTotalAmountt: any;
  financialYear: any;
  afterDiscountTotal: number = 0;

  invoiceForm = new FormGroup({
    billType: new FormControl("GST"),
    gstType: new FormControl("UP"),
    invoiceCateg: new FormControl("null"),
    customCateg: new FormControl("null"),
    billFormat: new FormControl(""),
    invoiceDate: new FormControl(),
    totalAmount: new FormControl(),
    GSTAmount: new FormControl(),
    billNumber: new FormControl(),
    discountValue: new FormControl(0),
    rows: this.fb.array([]),
    quotationNumber: new FormControl(''),
    //New
    noteText: new FormControl(''),
    noteHtml: new FormControl(''),
    termsHtml: new FormControl(''),
    termsList: new FormControl<string[]>([]),
    packageIncludesHtml: new FormControl(''),
    packageIncludesList: new FormControl<string[]>([]),
    paymentTermsHtml: new FormControl(''),
    paymentTermsList: new FormControl<string[]>([]),
    additionalNotesHtml: new FormControl(''),
    additionalNotesList: new FormControl<string[]>([]),
    visibilityFlags: new FormControl({})
  });
  custForm = new FormGroup({
    custName: new FormControl(''),
    custNumb: new FormControl(),
    custGST: new FormControl(""),
    custAddLine1: new FormControl(""),
    custAddLine2: new FormControl(""),
    custAddLine3: new FormControl("")
  })

  ngOnInit(): void {
    this.date = new Date();
    this.currentDate = this.formatDate(this.date);
    this.financialYear = this.getFinancialYear(this.date);
    // this.invoiceForm.get('billType')?.valueChanges.subscribe(value => {
    //   this.Bill = value;
    //   this.calculateGrandTotal();
    // });

    this.invoiceForm.get('discountValue')?.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    })

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
    //this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    // this.auth.getCustomer(this.getId).subscribe((res: any) => {
    //   this.data = res;
    //   this.name = this.data?.custName || '';
    //   this.number = this.data?.custNumb || '';

    //   this.custForm.patchValue({
    //     custName: this.name,
    //     custNumb: this.number
    //   });
    // });
    this.invoiceForm.get('billType')?.valueChanges.subscribe(value => {
      this.Bill = value;
      // Recalculate each row since billType affects GST
      this.rows.controls.forEach(control => {
        const row = control as FormGroup;
        this.calculateRowAmount(row);
      });
      this.calculateGrandTotal();
    });
    this.auth.estInvoiceCount().subscribe((res: any) => {
      this.count = (res ?? 0) + 1;
    });

    // Add initial row
    this.addRow();
  }

  constructor(private auth: AuthService, private fb: FormBuilder, private toastr: ToastrService) { }

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

  removeRow(index: number){
    if(this.rows.length === 1){
      const row = this.rows.at(0) as FormGroup;
      row.patchValue({
        invioceCateg: '',
        customCateg: '',
        numOfVideos: 0,
        priceOfVideos: 0,
        gst: 0,
        amt: 0
      });
    } else {
      this.rows.removeAt(index);
    }

    this.calculateGrandTotal();
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

    //row.get('amt')?.setValue(totalAmount);
    row.get('amt')?.setValue(parseFloat(totalAmount.toFixed(2)));
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

    const discountValue = Number(this.invoiceForm.get('discountValue')?.value || 0);
    this.totalAmount = Math.round(totalAmount);

    this.afterDiscountTotal = this.totalAmount - discountValue;
    this.gstAmount = totalGst;
    this.totalNumOfVideoss = Math.round(totalNumOfVideos);

    //Amount before GST (net amount)
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

    // Generate quotation number dynamically
    const quotationNumber = `ADM-${this.financialYear}/${160 + this.count}`;

    // Normalize invoice date to midnight UTC (00:00:00.000Z)
    const normalizedDate = new Date(this.date);
    normalizedDate.setUTCHours(0, 0, 0, 0); // Ensures consistent format
    this.invoiceForm.get('invoiceDate')?.setValue(normalizedDate.toISOString());

    // this.invoiceForm.get('invoiceDate')?.setValue(this.date);
    this.invoiceForm.get('GSTAmount')?.setValue(this.gstAmount || 0);
    this.invoiceForm.get('totalAmount')?.setValue(this.totalAmount || 0);
    this.invoiceForm.get('billFormat')?.setValue('Estimate');
    this.invoiceForm.get('billNumber')?.setValue(160 + this.count);
    this.invoiceForm.get('rows')?.setValue(rowsData);
    this.invoiceForm.get('quotationNumber')?.setValue(quotationNumber);

    // BEFORE building combinedData: read DOM directly for any contenteditable elements
const noteText = this.invoiceForm.get('noteText')?.value || '';
const noteHtml = (() => {
  const ta = document.querySelector('.bottom-txt') as HTMLTextAreaElement;
  return ta ? ta.value : noteText;
})();

// Terms (prefer DOM value, fallback to form control)
const termsEl = document.querySelector('.editable-terms') as HTMLElement | null;
const termsHtml = termsEl ? termsEl.innerHTML : (this.invoiceForm.get('termsHtml')?.value || '');

// Payment terms list: if you want raw html
const paymentTermsEl = document.querySelector('.editable-payment-terms') as HTMLElement | null;
const paymentTermsHtml = paymentTermsEl ? paymentTermsEl.innerHTML : (this.invoiceForm.get('paymentTermsHtml')?.value || '');

// Additional notes
const additionalNotesEl = document.querySelector('.editable-additional-notes') as HTMLElement | null;
const additionalNotesHtml = additionalNotesEl ? additionalNotesEl.innerHTML : (this.invoiceForm.get('additionalNotesHtml')?.value || '');

// Also extract list items as string arrays (structured)
const extractList = (el: Element | null) => {
  if (!el) return [] as string[];
  return Array.from(el.querySelectorAll('li')).map(li => (li.textContent || '').trim()).filter(s => s.length > 0);
};
const packageIncludesList = extractList(document.querySelector('#package-includes .features'));
const paymentTermsList = extractList(paymentTermsEl);
const additionalNotesList = extractList(additionalNotesEl);

// Set them to the form before sending
this.invoiceForm.get('noteHtml')?.setValue(noteHtml);
this.invoiceForm.get('termsHtml')?.setValue(termsHtml);
this.invoiceForm.get('paymentTermsHtml')?.setValue(paymentTermsHtml);
this.invoiceForm.get('additionalNotesHtml')?.setValue(additionalNotesHtml);

this.invoiceForm.get('packageIncludesList')?.setValue(packageIncludesList);
this.invoiceForm.get('paymentTermsList')?.setValue(paymentTermsList);
this.invoiceForm.get('additionalNotesList')?.setValue(additionalNotesList);

// visibility flags (as you already do)
this.invoiceForm.get('visibilityFlags')?.setValue({
  isMetaAdsVisible: this.isMetaAdsVisible(),
  isAdrunVisible: this.isAdrunVisible(),
  isWebDevelopmentVisible: this.isWebDevelopmentVisible(),
  isModelAvailabilityVisible: this.isModelAvailabilityVisible()
});

    const invoiceData = this.invoiceForm.value;
    const custData = this.custForm.value;
    const combinedData = { ...custData, ...invoiceData, financialYear: this.financialYear };

    this.auth.addCustomQuotation(combinedData).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success('Quotation saved Successfully', 'Success');
        this.generatePdf();
      } else if (res.sameDateExists) {
        // Case: Same Date – Ask to update
        Swal.fire({
          title: 'Quotation Already Exists on Same Date',
          text: res.message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Update It',
          cancelButtonText: 'No, Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.auth.addCustomQuotation({ ...combinedData, allowUpdate: true }).subscribe((res: any) => {
              if (res.success) {
                this.toastr.success('Quotation Updated Successfully', 'Success');
                this.generatePdf();
              } else {
                this.toastr.error('Error Updating Quotation', 'Error');
              }
            });
          } else {
            this.toastr.info('Update Cancelled', 'Info');
          }
        });
      } else if (res.differentDateExists) {
        // Case: Different date in same month – Ask to save new entry
        Swal.fire({
          title: 'Quotation Already Exists This Month',
          text: res.message,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Yes, Save New Entry',
          cancelButtonText: 'No, Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.auth.addCustomQuotation({ ...combinedData, allowNewDateEntry: true }).subscribe((res: any) => {
              if (res.success) {
                this.toastr.success('New Quotation Saved Successfully', 'Success');
                this.generatePdf();
              } else {
                this.toastr.error('Error Saving New Quotation', 'Error');
              }
            });
          } else {
            this.toastr.info('Save Cancelled', 'Info');
          }
        });
      } else {
        this.toastr.error('Error Saving Quotation', 'Error');
      }
    });
  }

  // place this method inside your EstInvoiceComponent class
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

    // --- 1) Replace textareas with divs that render line breaks ---
    this.replaceTextareasForPdf(invoiceElement);

    // compute exact on-screen pixel dimensions to preserve visual size
    const elementWidthPx = Math.ceil(invoiceElement.scrollWidth);
    const elementHeightPx = Math.ceil(invoiceElement.scrollHeight);

    //custom Name
    const customName = this.custForm.get('custName')?.value || '';

    // html2pdf options:
    const opt: any = {
      margin: 0, // keep 0 because we add padding inside the element (or set numeric/tuple if preferred)
      filename: `quotation_${customName || this.name || 'invoice'}.pdf`.replace(/\s+/g, '_'),
      image: { type: 'png', quality: 1.0 },
      html2canvas: {
        // scale: 1,          // 1 => preserve on-screen pixel sizes exactly (no upscaling)
        scale: 2,
        useCORS: true,
        logging: false,
        width: elementWidthPx,
        height: elementHeightPx,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        scrollY: -window.scrollY // avoid captured screenshot offset when page scrolled
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
        // restore replaced textareas
        this.restoreTextareasAfterPdf();
        // restore padding changes
        if (addPdfPadding) {
          invoiceElement.style.paddingTop = prevPaddingTop;
          invoiceElement.style.paddingBottom = prevPaddingBottom;
        }
      })
      .catch((err: any) => {
        console.error('html2pdf error:', err);
        this.restoreTextareasAfterPdf();
        // restore padding if any
        if (addPdfPadding) {
          invoiceElement.style.paddingTop = prevPaddingTop;
          invoiceElement.style.paddingBottom = prevPaddingBottom;
        }
      });
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getFinancialYear(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (month >= 4) {
      return `${(year).toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${year - 1}-${(year).toString().slice(-2)}`;
    }
  }
  isModelAvailabilityVisible(): boolean {
    // Agar koi row in categories me se select kare to Model Availability wala li HIDE karna hai
    const hideCategories = ['Logo Design', 'Website Development - Informative', 'Website Development - Ecommerce', 'Graphic Designing', 'Voice Over', 'Logo Animation', 'Ad Run',];

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
    const hideCategories = ['Advertisement Video', 'Other'];

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
  isAdrunVisible(): boolean {
    // Agar koi row in categories me se select kare to Model Availability wala li HIDE karna hai
    const hideCategories = ['Ad Run', 'Website Development - Informative', 'Website Development - Ecommerce'];

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

  isMetaAdsVisible(): boolean {
    const formArray = this.rows;
    let isVisible = false;
    this.isMetaAdsPremium = true;

    for (let i = 0; i < formArray.length; i++) {
      const grp = formArray.at(i) as FormGroup;
      const val = (grp.get('invoiceCateg')?.value || '').toString().trim();
      const custom = (grp.get('customCateg')?.value || '').toString().trim();

      if (val === 'Meta Ads - Standard' || custom === 'Meta Ads - Standard') {
        isVisible = true;
      }

      if (val === 'Meta Ads - Ecommerce' || custom === 'Meta Ads - Ecommerce') {
        isVisible = true;
        this.isMetaAdsPremium = false;
      }
    }
    return isVisible;
  }
  isMetaAdsPremium: boolean = true;

  isWebDevelopmentVisible(): boolean {
    const formArray = this.rows;
    let isVisible = false; // whether to show Website section
    this.isIntroductionWebsite = true; // reset visibility for 15 Products line

    for (let i = 0; i < formArray.length; i++) {
      const grp = formArray.at(i) as FormGroup;
      const val = (grp.get('invoiceCateg')?.value || '').toString().trim();
      const custom = (grp.get('customCateg')?.value || '').toString().trim();

      // ✅ If any category is Website Development — show section
      if (val === 'Website Development - Ecommerce' || custom === 'Website Development - Ecommerce') {
        isVisible = true;
      }

      // ❌ If category is Website Development - Informative — hide 15 Products line
      if (val === 'Website Development - Informative' || custom === 'Website Development - Informative') {
        isVisible = true; // still show section
        this.isIntroductionWebsite = false; // but hide product line
      }
    }

    return isVisible;
  }
  // property near other top-level properties
  isIntroductionWebsite: boolean = true;

  // inside your component class

  private replacedNodes: Array<{ textarea: HTMLTextAreaElement, placeholder?: HTMLElement, hiddenContainer?: HTMLElement }> = [];

  private replaceTextareasForPdf(rootEl: HTMLElement) {
    this.replacedNodes = [];
    const textareas = Array.from(rootEl.querySelectorAll<HTMLTextAreaElement>('textarea'));
    textareas.forEach(ta => {

      const value = (ta.value || '').toString();

      // If textarea is empty or just whitespace -> hide the container (and likely the preceding 'Note:' span)
      if (value.trim() === '') {
        // Choose a container that holds both the span 'Note:' and textarea.
        // Adjust the selector if your structure is different. This tries nearest div, then parent.
        const container = ta.closest('div') || ta.parentElement;

        if (container) {
          // hide container for PDF
          (container as HTMLElement).style.display = 'none';
          this.replacedNodes.push({ textarea: ta, hiddenContainer: container });
        } else {
          // fallback: hide the textarea itself
          ta.style.display = 'none';
          this.replacedNodes.push({ textarea: ta, hiddenContainer: ta });
        }

        return; // continue to next textarea
      }

      // create div to match visuals
      const div = document.createElement('div');
      div.className = 'pdf-textarea';
      // convert newlines to <br> and escape HTML
      const escaped = (ta.value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      div.innerHTML = escaped.replace(/\n/g, '<br>');
      // keep original style so it looks same in PDF
      const computed = window.getComputedStyle(ta);
      div.style.font = computed.font;
      div.style.lineHeight = computed.lineHeight;
      div.style.padding = computed.padding;
      div.style.border = computed.border;
      div.style.background = computed.backgroundColor;
      div.style.minHeight = computed.minHeight;
      div.style.whiteSpace = 'pre-wrap';
      div.style.boxSizing = 'border-box';

      // insert and record for revert
      ta.parentNode?.insertBefore(div, ta);
      // hide original textarea (so layout is identical and we can revert easily)
      ta.style.display = 'none';
      this.replacedNodes.push({ textarea: ta, placeholder: div });
    });
  }

  private restoreTextareasAfterPdf() {
    this.replacedNodes.forEach(item => {
      const ta = item.textarea;
      if (item.hiddenContainer) {
        (item.hiddenContainer as HTMLElement).style.display = '';
        // ensure textarea also visible (in case container fallback hid it)
        ta.style.display = '';
      }
      // if we replaced textarea with placeholder div, remove it and show textarea
      if (item.placeholder) {
        const placeholder = item.placeholder;
        placeholder.parentNode?.removeChild(placeholder);
        ta.style.display = '';
      }
    });
    this.replacedNodes = [];
  }
  onTermsHtmlChange(ev: any) {
    const html = ev.target.innerHTML;
    this.invoiceForm.get('termsHtml')?.setValue(html);
    // Also optionally construct termsList by splitting <li> items if you want structured list
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const items = Array.from(doc.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
    this.invoiceForm.get('termsList')?.setValue(items);
  }

}
