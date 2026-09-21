import { Component, ElementRef, NgZone, Renderer2, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent implements OnInit {

  getId: any;
  Category: any;
  countries: any;
  states: any;
  cities: any;
  tok: any;
  emp: any;
  companies: any;
  codeInput!: ElementRef<HTMLInputElement>;
  // financialYear: any;
  date: any;
  invoiceNumber: any;

  // Add near existing fields
  verifiedLocked = false;  // true => Verify button disabled
  lastVerified = { name: '', number: '' };
  lastVerifiedSuffix = '';

  verifyState: 'idle' | 'checking' | 'notfound' | 'mismatch' | 'match' = 'idle';
  verifyMsg = '';
  // add near other fields
  originalVerifiedQuotationSuffix: string | null = null;

  invoiceVerifyState: 'idle' | 'checking' | 'notfound' | 'mismatch' | 'match' = 'idle';
  invoiceVerifyMsg = '';
  invoiceVerifiedLocked = false;
  lastVerifiedInvoice = { name: '', number: '' };
  lastVerifiedInvoiceNumber = '';

  // NEW
  get financialYear(): string {
    const closingVal = this.updateForm.get('closingDate')?.value;
    const date = this.toDateOnly(closingVal) || new Date();
    return this.getFinancialYear(date);
  }

  ngOnInit(): void {

    this.updateForm.get('restAmount')?.valueChanges.subscribe(value => {

      const qrControl = this.updateForm.get('restAmountQr');

      if (Number(value) > 0) {
        qrControl?.setValidators([Validators.required]);
      } else {
        qrControl?.clearValidators();
        qrControl?.setValue("");       // optional - value reset
      }

      qrControl?.updateValueAndValidity();

      this.updateForm.get('closingPrice')?.valueChanges.subscribe(() => {
        this.calculateRemainingAmount();
      });

      this.updateForm.get('AdvPay')?.valueChanges.subscribe(() => {
        this.calculateRemainingAmount();
      });

      this.restPayments.valueChanges.subscribe(() => {
        this.calculateRemainingAmount();
      });
    });

    //Multiple restPayment k liye niche ki 3 line hatai
    // this.updateForm.get('AdvPay')!.valueChanges.subscribe(value => {
    //   this.updateForm.get('restAmount')!.setValue('0');
    // });

    // this.date = new Date();
    // this.financialYear = this.getFinancialYear(this.date);

    //NEW
    this.updateForm.get('closingDate')?.valueChanges.subscribe(() => {
      this.updateQuotationValidation();
      this.verifyState = 'idle';
      this.verifyMsg = '';
      this.verifiedLocked = false;
    });
    // new: when closing category changes, re-evaluate verification requirement
    this.updateForm.get('closingCateg')?.valueChanges.subscribe(() => {
      this.updateQuotationValidation();
    });

    // also call once on init to set validators according to default/loaded value
    this.updateQuotationValidation();

    // Jab name/number/suffix badle, aur pehle verify-locked tha, to unlock + reset messages
    const unlockIfIdentityChanged = () => {
      if (!this.verifiedLocked) return;

      const name = (this.updateForm.get('custName')?.value || '').toString().trim();
      const number = (this.updateForm.get('custNumb')?.value || '').toString().trim();
      const suffix = (this.updateForm.get('quotationSuffix')?.value || '').toString().trim();

      if (name !== this.lastVerified.name || number !== this.lastVerified.number || suffix !== this.lastVerifiedSuffix) {
        this.verifiedLocked = false;
        this.verifyState = 'idle';
        this.verifyMsg = '';
      }
    };

    this.updateForm.get('custName')?.valueChanges.subscribe(unlockIfIdentityChanged);
    this.updateForm.get('custNumb')?.valueChanges.subscribe(unlockIfIdentityChanged);
    this.updateForm.get('quotationSuffix')?.valueChanges.subscribe(unlockIfIdentityChanged);
  }

  ngAfterViewInit() {
    const inputElement = this.el.nativeElement.querySelector('input[type=text]');
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
  }
  safeVideoUrl: SafeResourceUrl | null = null;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    quotationNumber: new FormControl(""),
    quotationSuffix: new FormControl(""),
    invoiceInput: new FormControl(''),
    custName: new FormControl("", [Validators.required]),
    custNumb: new FormControl("", [Validators.required]),
    custNumb2: new FormControl(""),
    custEmail: new FormControl(""),
    custBussiness: new FormControl(""),
    closingDate: new FormControl("", [Validators.required]),
    closingPrice: new FormControl(""),
    closingCateg: new FormControl(""),
    billType: new FormControl("null"),
    AdvPay: new FormControl(),
    remainingAmount: new FormControl(""),
    restPayments: new FormArray([]),
    customerType: new FormControl(""),
    custCity: new FormControl(""),
    custState: new FormControl(""),
    custCountry: new FormControl(""),
    projectStatus: new FormControl("", [Validators.required]),
    salesPerson: new FormControl(""),
    youtubeLink: new FormControl(""),
    remark: new FormControl(""),
    // restAmount: new FormControl(),
    // restPaymentDate: new FormControl("", [Validators.required]),
    leadsCreatedDate: new FormControl(""),
    companyName: new FormControl(""),
    Qr: new FormControl("", [Validators.required]),
    graphicsCount: new FormControl(0),
    videosCount: new FormControl(0),
    reelsCount: new FormControl(0),
    restAmountQr: new FormControl(""),
    website: new FormControl("", [Validators.required]),
    websiteName: new FormControl(""),
    googleProfile: new FormControl("", [Validators.required]),
    ecomm: new FormControl("", [Validators.required])
  });

  updateEmbeddedVideoUrl() {
    const youtubeLink = this.updateForm.get('youtubeLink')!.value;
    if (youtubeLink) {
      const videoId = this.extractVideoId(youtubeLink);
      if (videoId) {
        const embeddedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embeddedVideoUrl);
      } else {
        this.safeVideoUrl = null;
      }
      //console.log("Video ID====>>", videoId);
    } else {
      this.safeVideoUrl = null;
    }
  }

  extractVideoId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }
  constructor(private router: Router, private ngZone: NgZone, private renderer: Renderer2, private el: ElementRef, private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer) {

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    //Multiple rest Payment k liye ye hatatya

    // this.updateForm.valueChanges.subscribe(values => {
    //   const closingPriceValue = parseFloat(values.closingPrice || '0');
    //   const AdvPayValue = parseFloat(values.AdvPay || '0');
    //   const restAmountValue = parseInt(values.restAmount || '0');
    //   const remainingAmount = closingPriceValue - AdvPayValue - restAmountValue;

    //   this.updateForm.get('remainingAmount')!.setValue(remainingAmount.toString());
    // });

    this.auth.allEmployee().subscribe((res: any) => {
      this.emp = res;
    });

    this.auth.getCustomer(this.getId).subscribe((res: any) => {

      console.log('========================================');
      console.log('GET CUSTOMER RESPONSE');
      console.log('Customer ID:', this.getId);
      console.log('Full Customer Response:', res);
      console.log('DB Rest Payments:', res.restPayments);
      console.log('========================================');

      if (res['custCode']) {
        this.updateForm.patchValue({
          custCode: res['custCode']
        });
      } else {
        this.auth.dataLength().subscribe((length: any) => {
          res['custCode'] = length + 1;
          this.updateForm.patchValue({
            custCode: res['custCode']
          });
        });
      }

      // NEW
      // const prefix = `ADM-${this.financialYear}/`;

      if (res['quotationNumber']) {
        // agar saved hai to suffix nikaal lo (prefix ke baad ka part)
        // const suffix = String(res['quotationNumber']).replace(prefix, '');

        //NEW
        const fullNumber = String(res['quotationNumber']);
        const suffix = fullNumber.split('/').pop();
        this.updateForm.patchValue({ quotationSuffix: suffix });
      } else {
        // naya — suffix blank, prefix UI me dikh jayega
        this.updateForm.patchValue({ quotationSuffix: '' });
      }

      this.invoiceNumber = res.invoiceNumber || []; // <-- store array here

      this.updateForm.patchValue({
        // quotationNumber: res['quotationNumber'],
        // quotationSuffix: res[''],
        custName: res['custName'],
        custNumb: res['custNumb'],
        custNumb2: res['custNumb2'],
        custEmail: res['custEmail'],
        custBussiness: res['custBussiness'],
        closingDate: this.formatDate(res['closingDate']),
        closingPrice: res['closingPrice'],
        closingCateg: res['closingCateg'],
        billType: res['billType'],
        AdvPay: res['AdvPay'],
        custCity: res['custCity'],
        remainingAmount: res['remainingAmount'],
        custState: res['custState'],
        custCountry: res['custCountry'],
        projectStatus: res['projectStatus'],
        salesPerson: res['salesPerson'],
        youtubeLink: res['youtubeLink'],
        remark: res['remark'],
        //restAmount: res['restAmount'],
        //restPaymentDate: this.formatDate(res['restPaymentDate']),
        leadsCreatedDate: res['leadsCreatedDate'],
        companyName: res['companyName'],
        Qr: res['Qr'],
        customerType: res['customerType'],
        graphicsCount: res['graphicCount'],
        videosCount: res['videosCount'],
        reelsCount: res['reelsCount'],
        restAmountQr: res['restAmountQr'],
        website: res['website'],
        websiteName: res['websiteName'],
        googleProfile: res['googleProfile'],
        ecomm: res['ecomm']
      })
      //new added
      // this.restPayments.clear();
      // if (Array.isArray(res.restPayments) && res.restPayments.length > 0) {
      //   res.restPayments.forEach((payment: any) => {
      //     const paymentGroup = this.createRestPayment();
      //     paymentGroup.patchValue({
      //       amount: payment.amount,
      //       date: this.formatDate(payment.date),

      //       invoiceCreated: payment.invoiceCreated || false,
      //       invoiceNumber: payment.invoiceNumber || '',
      //       invoiceDate: payment.invoiceDate ? this.formatDate(payment.invoiceDate) : ''
      //     });
      //     this.restPayments.push(paymentGroup);
      //   });
      // } else if (Number(res.restAmount) > 0) {

      //   const oldPayment = this.createRestPayment();
      //   oldPayment.patchValue({
      //     amount: res.restAmount,
      //     date: this.formatDate(res.restPaymentDate)
      //   });
      //   this.restPayments.push(oldPayment);
      // }
      // this.calculateRemainingAmount();


      // this.updateEmbeddedVideoUrl();
      // // Important: update validators based on closingDate after patch
      // this.updateQuotationValidation();

      // this.restoreCustomerDraft();

      // ============================================================
      // LOAD REST PAYMENTS FROM DATABASE
      // ============================================================

      // this.restPayments.clear();

      // if (Array.isArray(res.restPayments)) {

      //   res.restPayments.forEach((payment: any) => {

      //     const paymentGroup = this.createRestPayment();

      //     paymentGroup.patchValue(
      //       {
      //         amount: payment.amount ?? '',

      //         date: payment.date
      //           ? this.formatDate(payment.date)
      //           : '',

      //         invoiceCreated:
      //           payment.invoiceCreated === true,

      //         invoiceNumber:
      //           payment.invoiceNumber ?? '',

      //         invoiceDate:
      //           payment.invoiceDate
      //             ? this.formatDate(payment.invoiceDate)
      //             : ''
      //       },
      //       {
      //         emitEvent: false
      //       }
      //     );

      //     this.restPayments.push(paymentGroup);
      //   });
      // }

      // // Agar old single restAmount data hai
      // else if (Number(res.restAmount) > 0) {

      //   const oldPayment = this.createRestPayment();

      //   oldPayment.patchValue(
      //     {
      //       amount: res.restAmount,

      //       date: this.formatDate(res.restPaymentDate),

      //       invoiceCreated: false,

      //       invoiceNumber: '',

      //       invoiceDate: ''
      //     },
      //     {
      //       emitEvent: false
      //     }
      //   );

      //   this.restPayments.push(oldPayment);
      // }

      // this.calculateRemainingAmount();

      // this.updateEmbeddedVideoUrl();

      // this.updateQuotationValidation();


      // // IMPORTANT:
      // // DB se Rest Payment load hone ke BAAD hi draft restore
      // this.restoreCustomerDraft();
      // ============================================================
      // LOAD REST PAYMENTS FROM DATABASE
      // ============================================================

      console.log('----------------------------------------');
      console.log('STEP 1: REST PAYMENTS FROM DATABASE');
      console.log('res.restPayments =', res.restPayments);
      console.log('Is Array?', Array.isArray(res.restPayments));
      console.log('Count:', Array.isArray(res.restPayments)
        ? res.restPayments.length
        : 0
      );
      console.log('----------------------------------------');


      this.restPayments.clear();


      if (
        Array.isArray(res.restPayments) &&
        res.restPayments.length > 0
      ) {

        res.restPayments.forEach(
          (payment: any, index: number) => {

            console.log(
              `DB REST PAYMENT [${index}] RAW:`,
              payment
            );

            console.log(
              `DB REST PAYMENT [${index}] invoiceCreated:`,
              payment.invoiceCreated
            );

            console.log(
              `DB REST PAYMENT [${index}] invoiceNumber:`,
              payment.invoiceNumber
            );

            console.log(
              `DB REST PAYMENT [${index}] invoiceDate:`,
              payment.invoiceDate
            );


            const paymentGroup =
              this.createRestPayment();


            paymentGroup.patchValue(
              {

                amount:
                  payment.amount ?? '',

                date:
                  payment.date
                    ? this.formatDate(payment.date)
                    : '',

                invoiceCreated:
                  payment.invoiceCreated === true,

                invoiceNumber:
                  payment.invoiceNumber ?? '',

                invoiceDate:
                  payment.invoiceDate
                    ? this.formatDate(payment.invoiceDate)
                    : ''
              },

              {
                emitEvent: false
              }
            );


            this.restPayments.push(
              paymentGroup
            );


            // ========================================================
            // CHECK FORM GROUP AFTER PATCH
            // ========================================================

            console.log(
              `FORM PAYMENT [${index}] AFTER PATCH:`,
              paymentGroup.getRawValue()
            );

            console.log(
              `FORM PAYMENT [${index}] invoiceCreated:`,
              paymentGroup.get('invoiceCreated')?.value
            );

            console.log(
              `FORM PAYMENT [${index}] invoiceNumber:`,
              paymentGroup.get('invoiceNumber')?.value
            );

            console.log(
              `FORM PAYMENT [${index}] invoiceDate:`,
              paymentGroup.get('invoiceDate')?.value
            );
          }
        );

      } else {

        console.log(
          'NO REST PAYMENTS FOUND IN DATABASE'
        );


        // ============================================================
        // OLD SINGLE REST PAYMENT
        // ============================================================

        if (Number(res.restAmount) > 0) {

          const oldPayment =
            this.createRestPayment();


          oldPayment.patchValue(
            {
              amount:
                res.restAmount,

              date:
                this.formatDate(
                  res.restPaymentDate
                ),

              invoiceCreated: false,

              invoiceNumber: '',

              invoiceDate: ''
            },

            {
              emitEvent: false
            }
          );


          this.restPayments.push(
            oldPayment
          );
        }
      }


      // ============================================================
      // FINAL FORMARRAY CHECK BEFORE DRAFT RESTORE
      // ============================================================

      console.log('========================================');
      console.log('STEP 2: FORMARRAY BEFORE DRAFT RESTORE');
      console.log(
        'this.restPayments.getRawValue() =',
        this.restPayments.getRawValue()
      );
      console.log('========================================');


      this.calculateRemainingAmount();

      this.updateEmbeddedVideoUrl();

      this.updateQuotationValidation();


      // ============================================================
      // DRAFT RESTORE
      // ============================================================

      console.log(
        'STEP 3: CALLING restoreCustomerDraft()'
      );

      this.restoreCustomerDraft();


      // ============================================================
      // FINAL FORMARRAY CHECK AFTER DRAFT RESTORE
      // ============================================================

      console.log('========================================');
      console.log('STEP 4: FORMARRAY AFTER DRAFT RESTORE');
      console.log(
        'this.restPayments.getRawValue() =',
        this.restPayments.getRawValue()
      );

      console.log(
        'Invoice Created =',
        this.restPayments.at(0)
          ?.get('invoiceCreated')?.value
      );

      console.log(
        'Invoice Number =',
        this.restPayments.at(0)
          ?.get('invoiceNumber')?.value
      );

      console.log(
        'Invoice Date =',
        this.restPayments.at(0)
          ?.get('invoiceDate')?.value
      );

      console.log('========================================');
    });

    this.onRestAmountChange();

    this.auth.getCategory().subscribe((category: any) => {
      this.Category = category;
    });

    this.auth.getCountries().subscribe((Countrydata: any) => {
      this.countries = Countrydata;
    });
    this.auth.getCompany().subscribe((res: any) => {
      if (this.tok.salesTeam === 'Shiva Development') {
        this.companies = res.filter((company: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.companyName === company.companyName)
        );
      } else {
        this.updateForm.get('companyName')?.setValue('AdmixMedia');
      }
    });
  }

  private toDateOnly(dateVal: string | null | undefined): Date | null {
    if (!dateVal) return null;
    // if date contains time part already, try to parse it; else append T00:00
    if (dateVal.indexOf('T') >= 0) {
      return new Date(dateVal);
    }
    return new Date(dateVal + 'T00:00:00');
  }

  updateQuotationValidation() {
    const suffixCtrl = this.updateForm.get('quotationSuffix');
    const numberCtrl = this.updateForm.get('quotationNumber');

    const verificationNeeded = this.checkVerificationNeeded();

    if (verificationNeeded) {
      suffixCtrl?.setValidators([Validators.required]);
      numberCtrl?.clearValidators();
    } else {
      suffixCtrl?.clearValidators();
      // optional: clear suffix so user doesn't get stuck
      suffixCtrl?.setValue('');
      suffixCtrl?.markAsPristine();
      suffixCtrl?.markAsUntouched();

      numberCtrl?.clearValidators();
      numberCtrl?.updateValueAndValidity();

      // Reset verification UI state
      this.verifyState = 'idle';
      this.verifyMsg = '';
      this.verifiedLocked = false;   // reset lock when verification isn't required
    }

    suffixCtrl?.updateValueAndValidity();
    numberCtrl?.updateValueAndValidity();
  }

  checkVerificationNeeded(): boolean {
    const closingVal = this.updateForm.get('closingDate')?.value;
    if (!closingVal) return false;

    const closingDate = this.toDateOnly(closingVal);
    const cutoff = new Date('2025-10-01T00:00:00');
    const dateNeedsVerification = closingDate !== null && closingDate >= cutoff;

    const closingCategory = this.updateForm.get('closingCateg')?.value;
    // const categoryExcludesVerification = closingCategory === 'Logo Design';
    const closingCategoryNormalized = (closingCategory || '').toString().trim().toLowerCase();
    const categoryExcludesVerification = closingCategoryNormalized === 'logo design' || closingCategoryNormalized === 'logo animation' || closingCategoryNormalized === 'wishing video' || closingCategoryNormalized === 'graphic designing' || closingCategoryNormalized === 'holi wishing video' || closingCategoryNormalized === 'voice over' || closingCategoryNormalized === 'new year wishing video' || closingCategoryNormalized === 'video editing' || closingCategoryNormalized === 'cgi' || closingCategoryNormalized === 'yearly wishing video package';

    return dateNeedsVerification && !categoryExcludesVerification;
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  }

  onRestAmountChange() {
    this.updateForm.get('restAmount')?.valueChanges.subscribe((value: any) => {
      const restPaymentDateControl = this.updateForm.get('restPaymentDate');
      if (value > 0) {
        restPaymentDateControl?.setValidators([Validators.required]);
      } else {
        restPaymentDateControl?.clearValidators();
      }
      restPaymentDateControl?.updateValueAndValidity();
    });
  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate() {

    // const prefix = `ADM-${this.financialYear}/`;
    const suffix = (this.updateForm.value.quotationSuffix ?? '').toString().trim();

    this.updateForm.patchValue({
      quotationNumber: suffix ? this.prefix + suffix : this.prefix  // e.g. ADM-25-26/306
    });

    const currentDate = new Date().toISOString();
    if (!this.updateForm.get('AdvPay')!.value) {
      this.updateForm.get('AdvPay')?.setValue(0);
    }
    this.auth.updateCustomer(this.getId, this.updateForm.value).subscribe((res: any) => {
      sessionStorage.removeItem(`customerUpdateDraft_${this.getId}`);
      const projectStatusControl = this.updateForm.get('projectStatus');
      projectStatusControl?.valueChanges.subscribe(value => {
        if (value === 'Closing') {
          let selectedEmployee = this.emp.find((employee: any) => employee.signupRole === 'Admin');
          let msgTitle = "New Closing";
          let msgBody = `${this.updateForm.get('custBussiness')?.value} by ${this.tok.signupUsername}`;
          this.auth.sendNotification([selectedEmployee], msgTitle, msgBody, currentDate).subscribe((res: any) => {
            if (res) {
              alert("Notification Sent");
            } else {
              alert("Error Sending Notification");
            }
          });
        }
      });
      // Manually trigger the value change logic for projectStatus
      projectStatusControl?.setValue(projectStatusControl.value, { emitEvent: true });
      this.ngZone.run(() => { this.router.navigateByUrl('/salesHome/salesDashboard') })
    }, (err) => {
      console.log(err)
    })
  }

  onCountryChange(): void {
    const countryCode = this.updateForm.get('custCountry')?.value;
    this.auth.getStates(countryCode).subscribe((Statedata: any) => {
      this.states = Statedata;
    });
  }

  onStateChange(): void {
    const stateCode = this.updateForm.get('custState')?.value;
    const countryCode = this.updateForm.get('custCountry')?.value;
    this.auth.getCities(countryCode, stateCode).subscribe((Citydata: any) => {
      this.cities = Citydata;
    });
  }

  hasSalesPerson(): boolean {
    return this.updateForm.get('salesPerson')?.value === null;
  }
  getFinancialYear(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (month >= 4) {
      return `${(year).toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    } else {
      // return `${year - 1}-${(year).toString().slice(-2)}`;
      return `${(year - 1).toString().slice(-2)}-${year.toString().slice(-2)}`;

    }
  }

  get prefix(): string {
    return `ADM-${this.financialYear}/`;
  }
  onVerifyQuotation() {
    const suffix: string = (this.updateForm.get('quotationSuffix')?.value || '').toString().trim();
    if (!suffix) {
      this.verifyState = 'notfound';
      this.verifyMsg = 'Please enter quotation number';
      return;
    }

    this.verifyState = 'checking';
    this.verifyMsg = 'Checking...';

    const custName = this.updateForm.get('custName')?.value || '';
    const custNumb = this.updateForm.get('custNumb')?.value || '';

    this.auth.verifyQuotation(this.financialYear, suffix, custName, custNumb)
      .subscribe((res: any) => {
        if (!res.ok) {
          this.verifyState = 'notfound';
          this.verifyMsg = res.message || 'Could not verify';
          return;
        }
        if (!res.found) {
          this.verifyState = 'notfound';
          this.verifyMsg = 'Quotation not found';
          return;
        }
        if (res.match) {
          this.verifyState = 'match';
          this.verifyMsg = 'Quotation matches this customer';
          // Optionally set final quotationNumber field:
          this.updateForm.patchValue({ quotationNumber: this.prefix + suffix });
          // LOCK the verify button until name/number/suffix changes
          this.verifiedLocked = true;
          this.lastVerified = {
            name: (this.updateForm.get('custName')?.value || '').toString().trim(),
            number: (this.updateForm.get('custNumb')?.value || '').toString().trim(),
          };
          this.lastVerifiedSuffix = suffix;
        } else {
          this.verifyState = 'mismatch';
          if (res.mismatchFields?.length > 0) {
            this.verifyMsg = `${res.mismatchFields.join(' and ')} do not match`;
          } else {
            this.verifyMsg = 'Quotation number not matching this customer';
          }
        }
      }, _err => {
        this.verifyState = 'notfound';
        this.verifyMsg = 'Server error while verifying';
      });
  }

  onVerifyInvoice() {
    const invoiceNumber = (this.updateForm.get('invoiceInput')?.value || '').toString().trim();

    if (!invoiceNumber) {
      this.invoiceVerifyState = 'notfound';
      this.invoiceVerifyMsg = 'Please enter invoice number';
      return;
    }
    this.invoiceVerifyState = 'checking';
    this.invoiceVerifyMsg = 'Checking...';

    const custName = this.updateForm.get('custName')?.value || '';
    const custNumb = this.updateForm.get('custNumb')?.value || '';
    const billType = this.updateForm.get('billType')?.value || '';

    // this.auth.verifyInvoice(this.financialYear, invoiceNumber, custName, custNumb, billType).subscribe((res: any) => {
    this.auth.verifyInvoice(this.financialYear, invoiceNumber, custName, custNumb, billType).subscribe((res: any) => {

      if (!res.ok) {
        this.invoiceVerifyState = 'notfound';
        this.invoiceVerifyMsg = res.message;
        return;
      }
      if (!res.found) {
        this.invoiceVerifyState = 'notfound';
        this.invoiceVerifyMsg = 'Invoice not found';
        return;
      }

      if (res.match) {
        this.invoiceVerifyState = 'match';
        this.invoiceVerifyMsg = 'Invoice matches this customer';

        this.invoiceVerifiedLocked = true;

        this.lastVerifiedInvoice = {
          name: custName,
          number: custNumb
        };

        this.lastVerifiedInvoiceNumber = invoiceNumber;
      } else {
        this.invoiceVerifyState = 'mismatch';
        this.invoiceVerifyMsg = res.message;
      }
    }, () => {
      this.invoiceVerifyState = 'notfound',
        this.invoiceVerifyMsg = 'Server error'
    });
  }

  get restPayments(): FormArray {
    return this.updateForm.get('restPayments') as FormArray;
  }

  createRestPayment(): FormGroup {
    return new FormGroup({
      amount: new FormControl('', [
        Validators.required, Validators.min(0)
      ]),
      date: new FormControl('', [Validators.required]),
      invoiceCreated: new FormControl(false),
      invoiceNumber: new FormControl(''),
      invoiceDate: new FormControl('')
    });

  }

  addRestPayment(): void {
    this.restPayments.push(this.createRestPayment());
    this.calculateRemainingAmount();
  }
  removeRestPayment(index: number): void {
    this.restPayments.removeAt(index);
    this.calculateRemainingAmount();
  }

  calculateRemainingAmount(): void {
    const closingPrice = Number(
      this.updateForm.get('closingPrice')?.value || 0
    );

    const advancePayment = Number(
      this.updateForm.get('AdvPay')?.value || 0
    );

    const totalRestAmount = this.restPayments.controls.reduce((total, control) => {
      return total + Number(control.get('amount')?.value || 0);
    }, 0);

    const remainingAmount = closingPrice - advancePayment - totalRestAmount;

    // Existing restAmount field ko total rest payment rakhenge
    // this.updateForm.get('restAmount')?.setValue(
    //   totalRestAmount.toString(), { emitEvent: false}
    // );

    this.updateForm.get('remainingAmount')?.setValue(
      Math.max(remainingAmount, 0).toString(), { emitEvent: false }
    );
  }

  // createRestPaymentInvoice(index: number): void {
  //   const payment = this.restPayments.at(index);
  //   const amount = Number(
  //     payment.get('amount')?.value || 0
  //   );
  //   const date = payment.get('date')?.value;
  //   const invoiceCreated = payment.get('invoiceCreated')?.value;

  //   if(invoiceCreated) {
  //     return;
  //   }

  //   if(!amount || amount <= 0){
  //     alert('Please enter rest payment amount.');
  //     payment.get('amount')?.markAsTouched();
  //     return;
  //   }
  //   if(!date){
  //     alert('Please select rest payment date.');
  //     payment.get('date')?.markAsTouched();
  //     return;
  //   }
  //   this.invoice(this.getId, index);
  //   console.log('Created invoice for rest payment: ', { index, amount, date});
  // }

  createRestPaymentInvoice(index: number): void {
    const payment = this.restPayments.at(index);

    if (!payment) {
      return;
    }

    const amount = Number(payment.get('amount')?.value || 0);
    const date = payment.get('date')?.value;
    if (!amount || amount <= 0) {
      alert('Please enter rest payment amount.');
      payment.get('amount')?.markAsTouched();
      return;
    }
    if (!date) {
      alert('Please select rest payment date.');
      payment.get('date')?.markAsTouched();
      return;
    }
    const draftData = this.updateForm.getRawValue();
    sessionStorage.setItem(`customerUpdateDraft_${this.getId}`, JSON.stringify(draftData));
    this.invoice(this.getId, index);
  }
  // restoreCustomerDraft(): void{
  //   const draftKey = `customerUpdateDraft_${this.getId}`;
  //   const savedDraft = sessionStorage.getItem(draftKey);

  //   if(!savedDraft){
  //     return;
  //   }
  //   try{
  //     const draftData = JSON.parse(savedDraft);
  //       // this.updateForm.patchValue({
  //       //   ...draftData
  //       // }, {emitEvent: false});
  //       this.updateForm.patchValue(
  //         draftData,
  //         {emitEvent: false}
  //       );
  //       //DB se jo invoice status aaya hai usko temprarily save kar rahe
  //       const dbPayments = this.restPayments.controls.map(control => ({
  //         invoiceCreated: control.get('invoiceCreated')?.value || false,
  //         invoiceNumber: control.get('invoiceNumber')?.value || '',
  //         invoiceDate: control.get('invoiceDate')?.value || ''
  //       }));
  //       this.restPayments.clear();
  //       if(Array.isArray(draftData.restPayments)){
  //         draftData.restPayments.forEach((payment: any, index: number) => {
  //           const paymentGroup = this.createRestPayment();

  //           paymentGroup.patchValue({
  //             amount: payment.amount || '',
  //             date: payment.date || '',
  //             // invoiceCreated: payment.invoiceCreated || false,
  //             // invoiceNumber: payment.invoiceNumber || '',
  //             // invoiceDate: payment.invoiceDate || ''
  //             invoiceCreated: dbPayments[index]?.invoiceCreated ?? payment.invoiceCreated ?? false,
  //             invoiceNumber: dbPayments[index]?.invoiceNumber || payment.invoiceNumber || '',
  //             invoiceDate: dbPayments[index]?.invoiceDate || payment.invoiceDate || ''
  //           }, { emitEvent: false});
  //           this.restPayments.push(paymentGroup);
  //         });
  //       }
  //       this.calculateRemainingAmount();
  //       console.log('Customer draft restored:', draftData);
  //   }catch(error){
  //     console.error('Error restoring customer draft:', error);
  //   }
  // }

  // restoreCustomerDraft(): void {

  //   const draftKey = `customerUpdateDraft_${this.getId}`;
  //   const savedDraft = sessionStorage.getItem(draftKey);

  //   if (!savedDraft) {
  //     return;
  //   }

  //   try {

  //     const draftData = JSON.parse(savedDraft);

  //     // =========================================
  //     // 1. DB se already loaded Rest Payments
  //     //    ka invoice status PEHLE save karo
  //     // =========================================

  //     const dbPayments = this.restPayments.controls.map(
  //       (control) => ({
  //         invoiceCreated:
  //           control.get('invoiceCreated')?.value ?? false,

  //         invoiceNumber:
  //           control.get('invoiceNumber')?.value ?? '',

  //         invoiceDate:
  //           control.get('invoiceDate')?.value ?? ''
  //       })
  //     );


  //     // =========================================
  //     // 2. Normal customer fields restore karo
  //     //    RestPayments ko yahan patch MAT karo
  //     // =========================================

  //     const {
  //       restPayments,
  //       ...normalDraftData
  //     } = draftData;

  //     this.updateForm.patchValue(
  //       normalDraftData,
  //       {
  //         emitEvent: false
  //       }
  //     );


  //     // =========================================
  //     // 3. Rest Payments restore
  //     // =========================================

  //     this.restPayments.clear();

  //     if (Array.isArray(restPayments)) {

  //       restPayments.forEach(
  //         (payment: any, index: number) => {

  //           const paymentGroup =
  //             this.createRestPayment();

  //           paymentGroup.patchValue(
  //             {
  //               // Draft se amount/date
  //               amount: payment.amount || '',
  //               date: payment.date || '',

  //               // DB ka invoice status priority
  //               invoiceCreated:
  //                 dbPayments[index]?.invoiceCreated ?? false,

  //               invoiceNumber:
  //                 dbPayments[index]?.invoiceNumber || '',

  //               invoiceDate:
  //                 dbPayments[index]?.invoiceDate || ''
  //             },
  //             {
  //               emitEvent: false
  //             }
  //           );

  //           this.restPayments.push(paymentGroup);
  //         }
  //       );
  //     }


  //     // =========================================
  //     // 4. Remaining Amount dobara calculate
  //     // =========================================

  //     this.calculateRemainingAmount();


  //     console.log(
  //       'DB Rest Payments:',
  //       this.restPayments.getRawValue()
  //     );
  //     console.log(
  //       'Customer draft restored:',
  //       this.updateForm.getRawValue()
  //     );

  //   } catch (error) {

  //     console.error(
  //       'Error restoring customer draft:',
  //       error
  //     );

  //   }
  // }

  restoreCustomerDraft(): void {

    console.log('========================================');
    console.log('RESTORE CUSTOMER DRAFT START');
    console.log('========================================');

    const draftKey =
      `customerUpdateDraft_${this.getId}`;

    const savedDraft =
      sessionStorage.getItem(draftKey);

      console.log(
    'Draft Key:',
    draftKey
  );

  console.log(
    'Draft Exists:',
    !!savedDraft
  );

    if (!savedDraft) {
      console.log(
      'NO DRAFT FOUND - RESTORE SKIPPED'
    );
      return;
    }

    try {

      const draftData =
        JSON.parse(savedDraft);

        console.log(
      'DRAFT DATA:',
      draftData
    );

    console.log(
      'DRAFT REST PAYMENTS:',
      draftData.restPayments
    );

      // ==========================================================
      // STEP 1
      // DB SE JO CURRENT INVOICE STATUS AAYA HAI
      // USKO PEHLE SAVE KARO
      // ==========================================================

      const dbPayments =
        this.restPayments.controls.map(
          (control: AbstractControl) => {

            return {
              invoiceCreated:
                control.get('invoiceCreated')?.value === true,

              invoiceNumber:
                control.get('invoiceNumber')?.value ?? '',

              invoiceDate:
                control.get('invoiceDate')?.value ?? ''
            };
          }
        );


      console.log(
        'DB PAYMENT STATUS BEFORE DRAFT:',
        dbPayments
      );


      // ==========================================================
      // STEP 2
      // NORMAL CUSTOMER DATA RESTORE
      //
      // restPayments ko patch nahi karna
      // ==========================================================

      const {
        restPayments: draftRestPayments,
        ...normalDraftData
      } = draftData;


      this.updateForm.patchValue(
        normalDraftData,
        {
          emitEvent: false
        }
      );


      // ==========================================================
      // STEP 3
      // REST PAYMENTS CLEAR
      // ==========================================================

      this.restPayments.clear();


      // ==========================================================
      // STEP 4
      // DRAFT REST PAYMENTS RESTORE
      // ==========================================================

      if (Array.isArray(draftRestPayments)) {

        draftRestPayments.forEach(
          (payment: any, index: number) => {

            const paymentGroup =
              this.createRestPayment();


            // DB status
            const dbPayment =
              dbPayments[index];


            paymentGroup.patchValue(
              {

                // =================================================
                // AMOUNT
                // Draft ka amount use hoga
                // =================================================

                amount:
                  payment.amount ?? '',


                // =================================================
                // DATE
                // Draft ki date use hogi
                // =================================================

                date:
                  payment.date
                    ? this.formatDate(payment.date)
                    : '',


                // =================================================
                // INVOICE CREATED
                //
                // DB ko FIRST PRIORITY
                // =================================================

                invoiceCreated:
                  dbPayment
                    ? dbPayment.invoiceCreated
                    : payment.invoiceCreated === true,


                // =================================================
                // INVOICE NUMBER
                //
                // DB ko FIRST PRIORITY
                // =================================================

                invoiceNumber:
                  dbPayment &&
                    dbPayment.invoiceNumber
                    ? dbPayment.invoiceNumber
                    : (payment.invoiceNumber ?? ''),


                // =================================================
                // INVOICE DATE
                //
                // DB ko FIRST PRIORITY
                // =================================================

                invoiceDate:
                  dbPayment &&
                    dbPayment.invoiceDate
                    ? dbPayment.invoiceDate
                    : (
                      payment.invoiceDate
                        ? this.formatDate(
                          payment.invoiceDate
                        )
                        : ''
                    )
              },

              {
                emitEvent: false
              }
            );


            this.restPayments.push(
              paymentGroup
            );
          }
        );
      }


      // ==========================================================
      // STEP 5
      // VERY IMPORTANT:
      // DB PAYMENT COUNT > DRAFT PAYMENT COUNT
      //
      // Agar invoice create karte waqt DB me payment add hua hai
      // aur draft old hai, to DB payment ko bhi restore karo.
      // ==========================================================

      if (
        dbPayments.length >
        this.restPayments.length
      ) {

        for (
          let i = this.restPayments.length;
          i < dbPayments.length;
          i++
        ) {

          const dbPayment =
            dbPayments[i];


          const paymentGroup =
            this.createRestPayment();


          paymentGroup.patchValue(
            {
              amount: '',

              date: '',

              invoiceCreated:
                dbPayment.invoiceCreated,

              invoiceNumber:
                dbPayment.invoiceNumber,

              invoiceDate:
                dbPayment.invoiceDate
            },

            {
              emitEvent: false
            }
          );


          this.restPayments.push(
            paymentGroup
          );
        }
      }


      // ==========================================================
      // STEP 6
      // FINAL DEBUG
      // ==========================================================

      console.log(
        'FINAL REST PAYMENTS:',
        this.restPayments.getRawValue()
      );


      // ==========================================================
      // STEP 7
      // CALCULATE REMAINING
      // ==========================================================

      this.calculateRemainingAmount();


    } catch (error) {

      console.error(
        'Error restoring customer draft:',
        error
      );
    }
  }

  invoice(userId: string, restPaymentIndex?: number) {
    let url = `/salesHome/main-invoice/${userId}`;

    if (restPaymentIndex !== undefined) {
      url += `?restPaymentIndex=${restPaymentIndex}`;
    }
    window.location.href = url;
  }
}