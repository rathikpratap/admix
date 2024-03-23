import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent {

  integerRegex = '^((\\+91-?)|0)?[0-9]{10}$';
  message:string = '';
  isProcess:boolean = false;
  className = 'd-none'
  tok!:any;
  dataLength!:any;
  countries: any;
  states: any;
  cities: any;
  Category: any;

  codeInput!: ElementRef<HTMLInputElement>;
  
  

  ngAfterViewInit() {
    console.log("Its Called");
    const inputElement = this.el.nativeElement.querySelector('input[type=text]');
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
    
  }
 
  constructor(private auth:AuthService, private router:Router, private renderer: Renderer2, private el: ElementRef){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data; 

      if(this.tok) {
        this.customerForm.get('salesPerson')!.setValue(this.tok.signupUsername);
      }else{
        alert("Please Login Again")
        this.router.navigate(['/login']);
      }
    });

    this.auth.dataLength().subscribe((list : any)=>{
      this.dataLength = list + 1; 
      if(this.dataLength){
        this.customerForm.get('custCode')!.setValue(this.dataLength);
      }
    })

    this.customerForm.valueChanges.subscribe(values =>{
      const closingPriceValue = parseFloat(values.closingPrice|| '0');
      const AdvPayValue = parseFloat(values.AdvPay|| '0');

      const remainingAmount = closingPriceValue - AdvPayValue;
      
      this.customerForm.get('remainingAmount')!.setValue(remainingAmount.toString());

    });

    this.auth.getCountries().subscribe((Countrydata: any) =>{
      console.log("data==>", Countrydata);
      this.countries = Countrydata;
    });

    this.auth.getCategory().subscribe((category:any)=>{
      console.log("Categories===>>", category);
      this.Category = category;
    })
    
  }

  customerForm = new FormGroup({
    custCode : new FormControl("", [Validators.required]),
    custName : new FormControl("", [Validators.required]),
    custNumb : new FormControl("", [Validators.required, Validators.pattern(this.integerRegex)]),
    custBussiness : new FormControl("", [Validators.required]),
    closingDate : new FormControl("", [Validators.required]),
    closingPrice : new FormControl("", [Validators.required]),
    closingCateg : new FormControl("null", [Validators.required]),
    AdvPay : new FormControl("", [Validators.required]),
    remainingAmount : new FormControl("",[Validators.required]),
    custCountry : new FormControl("null", [Validators.required]),
    custCity : new FormControl("null", [Validators.required]),
    custState : new FormControl("null", [Validators.required]),
    projectStatus : new FormControl("null",[Validators.required]),
    salesPerson : new FormControl("",[Validators.required]),
    youtubeLink : new FormControl(""),
    remark  : new FormControl("",[Validators.required])
    
  })
 
  getControls(name: any) : AbstractControl | null{
    return this.customerForm.get(name)
  }

  onCountryChange(): void{
    const countryCode = this.customerForm.get('custCountry')?.value;
    this.auth.getStates(countryCode).subscribe((Statedata : any)=>{
      console.log("States==>", Statedata)
      this.states = Statedata;
    });
  }

  onStateChange(): void{
    const stateCode = this.customerForm.get('custState')?.value;
    const countryCode = this.customerForm.get('custCountry')?.value;
    this.auth.getCities(countryCode, stateCode).subscribe((Citydata : any)=>{
      console.log("Cities==>", Citydata);
      this.cities = Citydata;
    });
  }

  addCust(){

    this.isProcess = true;
    console.warn(this.customerForm.value);
    const custData = this.customerForm.value;
    this.auth.addcustomer(custData).subscribe(res =>{
      if(res.success){
        this.isProcess = false;
        this.message = "Customer Added";
        this.className = 'alert alert-success';
        this.customerForm.reset();
        this.customerForm.get('custCode')!.setValue(this.dataLength + 1);
      }else{
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
      }
    },err =>{
      this.isProcess = false;
      this.message = "Server Error";
      this.className = 'alert alert-danger';
    })
  }

  

}
