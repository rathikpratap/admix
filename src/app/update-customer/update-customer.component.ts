import { Component, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent {

  getId: any;
  Category: any;
  countries: any; 
  states: any;
  cities: any;
  tok:any;
  emp:any;
  companies: any;

  codeInput!: ElementRef<HTMLInputElement>;
  
  

  ngAfterViewInit() {
    console.log("Its Called");
    const inputElement = this.el.nativeElement.querySelector('input[type=text]');
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
    
  }
  
  safeVideoUrl: SafeResourceUrl | null = null;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    custName: new FormControl("", [Validators.required]),
    custNumb: new FormControl("", [Validators.required]),
    custEmail: new FormControl(""),
    custBussiness: new FormControl("", [Validators.required]),
    closingDate: new FormControl("", [Validators.required]),
    closingPrice: new FormControl(""),
    closingCateg: new FormControl(""),
    billType: new FormControl("null"),
    AdvPay: new FormControl(""),
    remainingAmount: new FormControl(""),
    custCity: new FormControl(""),
    custState: new FormControl(""),
    custCountry: new FormControl(""),
    projectStatus: new FormControl("", [Validators.required]),
    salesPerson: new FormControl(""),
    youtubeLink: new FormControl(""),
    remark: new FormControl(""),
    restAmount: new FormControl(""),
    restPaymentDate: new FormControl(""),
    leadsCreatedDate: new FormControl(""),
    companyName: new FormControl("")
  })

  updateEmbeddedVideoUrl() {
    const youtubeLink = this.updateForm.get('youtubeLink')!.value;
    if (youtubeLink) {
      const videoId = this.extractVideoId(youtubeLink);
      if(videoId){
        const embeddedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embeddedVideoUrl);
      } else{
        this.safeVideoUrl = null;
      }
      console.log("Video ID====>>", videoId);
    }else {
      this.safeVideoUrl = null;
    }
  }

  extractVideoId(url: string): string | null {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }


  constructor(private router: Router, private ngZone: NgZone,private renderer: Renderer2, private el: ElementRef, private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer) {
    
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
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

    this.auth.allEmployee().subscribe((res: any)=>{
      this.emp = res;
      console.log("Emp===>", this.emp)
    })
 
    this.auth.getCustomer(this.getId).subscribe((res: any) => {
      console.log("res ==>", res);
 
      if(res['custCode']){
        console.log("COdee====>>", res['custCode']);
        this.updateForm.patchValue({
          custCode: res['custCode']
        });
      }else{
        console.log("Code not found===>>");
        this.auth.dataLength().subscribe((length:any)=>{
          res['custCode']=length+1;
          console.log("new Code==>", res['custCode']);
          this.updateForm.patchValue({
            custCode: res['custCode']
          }); 
        })
      }

      this.updateForm.patchValue({

        
        custName: res['custName'],
        custNumb: res['custNumb'],
        custEmail: res['custEmail'],
        custBussiness: res['custBussiness'],
        closingDate: res['closingDate'],
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
        restPaymentDate: res['restPaymentDate'],
        leadsCreatedDate: res['leadsCreatedDate'],
        companyName: res['companyName']
      })
      this.updateEmbeddedVideoUrl();
    });

    this.auth.getCategory().subscribe((category:any)=>{
      console.log("Categories===>>", category);
      this.Category = category;
    })

    this.auth.getCountries().subscribe((Countrydata: any) =>{
      console.log("data==>", Countrydata);
      this.countries = Countrydata;
    });
    this.auth.getCompany().subscribe((res:any)=>{
      if(this.tok.salesTeam === 'Shiva Development') {
        this.companies = res.filter((company: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.companyName === company.companyName)
        );
      } else{
        this.updateForm.get('companyName')?.setValue('AdmixMedia');
      }
    });
  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }
 
  onUpdate() {
    this.auth.updateCustomer(this.getId, this.updateForm.value).subscribe((res: any) => {
      console.log("Data Updated Successfully");
      this.ngZone.run(() => { this.router.navigateByUrl('/salesHome/salesDashboard') })
    }, (err) => {
      console.log(err)
    })
  }

  onCountryChange(): void{
    const countryCode = this.updateForm.get('custCountry')?.value;
    this.auth.getStates(countryCode).subscribe((Statedata : any)=>{
      console.log("States==>", Statedata)
      this.states = Statedata;
    });
  }

  onStateChange(): void{
    const stateCode = this.updateForm.get('custState')?.value;
    const countryCode = this.updateForm.get('custCountry')?.value;
    this.auth.getCities(countryCode, stateCode).subscribe((Citydata : any)=>{
      console.log("Cities==>", Citydata);
      this.cities = Citydata;
    });
  }

  hasSalesPerson(): boolean {
    return this.updateForm.get('salesPerson')?.value === null;
  }
}
 