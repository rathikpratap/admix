import { Component, ElementRef, NgZone, Renderer2, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
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
  financialYear: any;
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
  });

    this.updateForm.get('AdvPay')!.valueChanges.subscribe(value => {
      this.updateForm.get('restAmount')!.setValue('0');
    });
    this.date = new Date();
    this.financialYear = this.getFinancialYear(this.date);
    this.updateForm.get('closingDate')?.valueChanges.subscribe(() => {
      this.updateQuotationValidation();
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
    customerType: new FormControl(""),
    custCity: new FormControl(""),
    custState: new FormControl(""),
    custCountry: new FormControl(""),
    projectStatus: new FormControl("", [Validators.required]),
    salesPerson: new FormControl(""),
    youtubeLink: new FormControl(""),
    remark: new FormControl(""),
    restAmount: new FormControl(),
    restPaymentDate: new FormControl("", [Validators.required]),
    leadsCreatedDate: new FormControl(""),
    companyName: new FormControl(""),
    Qr: new FormControl("", [Validators.required]),
    graphicsCount: new FormControl(0),
    videosCount: new FormControl(0),
    reelsCount: new FormControl(0),
    restAmountQr: new FormControl("")
  })

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

    this.updateForm.valueChanges.subscribe(values => {
      const closingPriceValue = parseFloat(values.closingPrice || '0');
      const AdvPayValue = parseFloat(values.AdvPay || '0');
      const restAmountValue = parseInt(values.restAmount || '0');
      const remainingAmount = closingPriceValue - AdvPayValue - restAmountValue;

      this.updateForm.get('remainingAmount')!.setValue(remainingAmount.toString());
    });

    this.auth.allEmployee().subscribe((res: any) => {
      this.emp = res;
    });

    this.auth.getCustomer(this.getId).subscribe((res: any) => {

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

      const prefix = `ADM-${this.financialYear}/`;

      if (res['quotationNumber']) {
        // agar saved hai to suffix nikaal lo (prefix ke baad ka part)
        const suffix = String(res['quotationNumber']).replace(prefix, '');
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
        restAmount: res['restAmount'],
        restPaymentDate: this.formatDate(res['restPaymentDate']),
        leadsCreatedDate: res['leadsCreatedDate'],
        companyName: res['companyName'],
        Qr: res['Qr'],
        customerType: res['customerType'],
        graphicsCount: res['graphicCount'],
        videosCount: res['videosCount'],
        reelsCount: res['reelsCount'],
        restAmountQr: res['restAmountQr']
      })
      this.updateEmbeddedVideoUrl();
      // Important: update validators based on closingDate after patch
      this.updateQuotationValidation();
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

    const prefix = `ADM-${this.financialYear}/`;
    const suffix = (this.updateForm.value.quotationSuffix ?? '').toString().trim();

    this.updateForm.patchValue({
      quotationNumber: suffix ? prefix + suffix : prefix  // e.g. ADM-25-26/306
    });

    const currentDate = new Date().toISOString();
    if (!this.updateForm.get('AdvPay')!.value) {
      this.updateForm.get('AdvPay')?.setValue(0);
    }
    this.auth.updateCustomer(this.getId, this.updateForm.value).subscribe((res: any) => {
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
}