import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import numWords from 'num-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
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
  Category: any;

  constructor(private auth: AuthService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.date = new Date();
    this.invoiceForm = this.fb.group({
      billNumber: [''],
      billType: [''],
      gstType: [''],
      GSTAmount: [0],
      totalAmount: [0],
      invoiceDate: [new Date()],
      noteText: [''],
      noteHtml: [''],
      termsHtml: [''],
      packageIncludesHtml: [''],
      packageIncludesList: [[]],
      paymentTermsHtml: [''],
      paymentTermsList: [[]],
      additionalNotesHtml: [''],
      additionalNotesList: [[]],
      visibilityFlags: [{}],
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
    this.auth.getCategory().subscribe((res: any) => {
      this.Category = res;
    });

    this.auth.getSelectedInvoice(this.getId).subscribe((res: any) => {
      this.invoiceData = res;
      this.name = res.custName;
      this.formatType = res.billFormat;
      console.log("FORMAT TYPE======>>", this.formatType);

      // Use invoice date from backend, not current date
      this.date = res.date ? new Date(res.date) : new Date();
      this.financialYear = res.financialYear || this.getFinancialYear(this.date);

      this.invoiceForm.patchValue({
        billType: res.billType,
        gstType: res.gstType,
        billNumber: res.billNumber || '',
        invoiceDate: this.date, // <- set correct date
        noteText: res.noteText || '',
        noteHtml: res.noteHtml || '',
        termsHtml: res.termsHtml || '',
        packageIncludesHtml: res.packageIncludesHtml || '',
        packageIncludesList: res.packageIncludesList || [],
        paymentTermsHtml: res.paymentTermsHtml || '',
        paymentTermsList: res.paymentTermsList || [],
        additionalNotesHtml: res.additionalNotesHtml || '',
        additionalNotesList: res.additionalNotesList || [],
        visibilityFlags: res.visibilityFlags || {}
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

      // IMPORTANT: set the actual contenteditable innerHTML from stored HTML after DOM render
      setTimeout(() => {
        const termsContainer = document.querySelector('.editable-terms') as HTMLElement | null;
        if (termsContainer && (res.termsHtml || '').trim()) termsContainer.innerHTML = res.termsHtml;
        // payment terms / additional notes -> set innerHTML if available
        const payEl = document.querySelector('.editable-payment-terms') as HTMLElement | null;
        if (payEl && (res.paymentTermsHtml || '').trim()) payEl.innerHTML = res.paymentTermsHtml;
        const addEl = document.querySelector('.editable-additional-notes') as HTMLElement | null;
        if (addEl && (res.additionalNotesHtml || '').trim()) addEl.innerHTML = res.additionalNotesHtml;
      }, 0);

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

  removeRow(index: number) {
    if (this.rows.length === 1) {
      const row = this.rows.at(0) as FormGroup;
      row.patchValue({
        invoiceCateg: '',
        customCateg: '',
        numOfVideos: 0,
        priceOfVideos: 0,
        gst: 0,
        amt: 0
      });
    } else {
      this.rows.removeAt(index);
    }
    this.calculateTotals();
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

    // 3) Read DOM for editable sections (ensures latest user edits)
    // const noteHtml = (() => {
    //   const ta = document.querySelector('.bottom-txt') as HTMLTextAreaElement | null;
    //   if (ta) {
    //     this.invoiceForm.get('noteHtml')?.setValue(ta.value); // optional HTML snapshot
    //   }
    // })();

    // read DOM for editable sections
    const ta = document.querySelector('.bottom-txt') as HTMLTextAreaElement | null;
    if (ta) {
      this.invoiceForm.get('noteText')?.setValue(ta.value);
      this.invoiceForm.get('noteHtml')?.setValue(ta.value);
    }
    const termsEl = document.querySelector('.editable-terms') as HTMLElement | null;
    const termsHtml = termsEl ? termsEl.innerHTML : this.invoiceForm.get('termsHtml')?.value || '';
    const packageHtml = document.querySelector('#package-includes')?.innerHTML || this.invoiceForm.get('packageIncludesHtml')?.value || '';
    const payEl = document.querySelector('.editable-payment-terms') as HTMLElement | null;
    const paymentTermsHtml = payEl ? payEl.innerHTML : this.invoiceForm.get('paymentTermsHtml')?.value || '';
    const addEl = document.querySelector('.editable-additional-notes') as HTMLElement | null;
    const additionalNotesHtml = addEl ? addEl.innerHTML : this.invoiceForm.get('additionalNotesHtml')?.value || '';

    const extractList = (el: Element | null) => {
      if (!el) return [] as string[];
      return Array.from(el.querySelectorAll('li')).map(li => (li.textContent || '').trim()).filter(Boolean);
    };
    const packageIncludesList = extractList(document.querySelector('#package-includes .features'));
    const paymentTermsList = extractList(payEl);
    const additionalNotesList = extractList(addEl);

    // set these fields on the form (so this.invoiceForm.value contains them)
    this.invoiceForm.patchValue({
      noteText: this.invoiceForm.get('noteText')?.value || '',
      noteHtml: this.invoiceForm.get('noteHtml')?.value || '',
      termsHtml,
      packageIncludesHtml: packageHtml,
      packageIncludesList,
      paymentTermsHtml: paymentTermsHtml,
      paymentTermsList,
      additionalNotesHtml,
      additionalNotesList,
      visibilityFlags: {
        isMetaAdsVisible: this.isMetaAdsVisible(),
        isAdrunVisible: this.isAdrunVisible(),
        isWebDevelopmentVisible: this.isWebDevelopmentVisible(),
        isModelAvailabilityVisible: this.isModelAvailabilityVisible()
      }
    });

    const invoiceData = this.invoiceForm.value;
    const custData = this.custForm.value;
    const combinedData = { ...custData, ...invoiceData, financialYear: this.financialYear, _id: this.invoiceData._id };

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
                this.toastr.error('Error Saving Invoice1', 'Error');
              }
            });
          } else {
            this.toastr.error('Error Saving Invoice2', 'Error');
          }
        });
      } else {
        this.toastr.error('Error Saving Invoice3', "Error");
      }
    });
  }

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

    this.replaceTextareasForPdf(invoiceElement);
    // compute exact on-screen pixel dimensions to preserve visual size
    const elementWidthPx = Math.ceil(invoiceElement.scrollWidth);
    const elementHeightPx = Math.ceil(invoiceElement.scrollHeight);

    // html2pdf options:
    const opt: any = {
      margin: 0, // keep 0 because we add padding inside the element (or set numeric/tuple if preferred)
      filename: `invoice_${this.name || 'invoice'}.pdf`.replace(/\s+/g, '_'),
      image: { type: 'png', quality: 1.0 },
      html2canvas: {
        scale: 2,          // 1 => preserve on-screen pixel sizes exactly (no upscaling)
        useCORS: true,
        logging: false,
        width: elementWidthPx,
        height: elementHeightPx,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        scrollY: -window.scrollY
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
  getFinancialYear(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (month >= 4) {
      return `${(year).toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${(year - 1).toString().slice(-2)}-${(year).toString().slice(-2)}`;
    }
  }

  hasLogoCategory(): boolean {
    return this.rows.controls.some(row => {
      const categ = row.get('invoiceCateg')?.value?.toLowerCase();
      return categ === 'logo design' || categ === 'logo animation' || categ === ' wishing video' || categ === 'website development' || categ === 'graphic designing' || categ === 'voice over' || categ === 'ad run';
    });
  }
  hasAdverCategory(): boolean {
    return this.rows.controls.some(row => {
      const categ = row.get('invoiceCateg')?.value?.toLowerCase();
      return categ === 'advertisement video';
    });
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
      if (val === 'Website Development' || custom === 'Website Development') {
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
  isModelAvailabilityVisible(): boolean {
    // Agar koi row in categories me se select kare to Model Availability wala li HIDE karna hai
    const hideCategories = ['Logo Design', 'Website Development - Informative', 'Website Development - Ecommerce', 'Graphic Designing', 'Voice Over', 'Logo Animation', 'Ad Run'];

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
  // onTermsHtmlChange: keep/update as earlier to update form control live
  onTermsHtmlChange(ev: any) {
    const html = (ev.target as HTMLElement).innerHTML;
    this.invoiceForm.get('termsHtml')?.setValue(html);
    // also update structured termsList if needed
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const items = Array.from(doc.querySelectorAll('li')).map(li => (li.textContent || '').trim()).filter(Boolean);
    if (this.invoiceForm.get('termsList')) (this.invoiceForm.get('termsList') as any).setValue(items);
  }
}