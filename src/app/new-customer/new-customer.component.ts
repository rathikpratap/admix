import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent {

  integerRegex = /^\d+$/;
  message:string = '';
  isProcess:boolean = false;
  className = 'd-none'
  tok!:any;
  
 
  constructor(private auth:AuthService){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;

      if(this.tok) {
        this.customerForm.get('salesPerson')!.setValue(this.tok.signupUsername);
      }
    });

    this.customerForm.valueChanges.subscribe(values =>{
      const closingPriceValue = parseFloat(values.closingPrice|| '0');
      const AdvPayValue = parseFloat(values.AdvPay|| '0');

      const remainingAmount = closingPriceValue - AdvPayValue;

      this.customerForm.get('remainingAmount')!.setValue(remainingAmount.toString());

    });

    
  }

  customerForm = new FormGroup({
    custCode : new FormControl("", [Validators.required]),
    custName : new FormControl("", [Validators.required]),
    custNumb : new FormControl("", [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.integerRegex)]),
    custBussiness : new FormControl("", [Validators.required]),
    closingDate : new FormControl("", [Validators.required]),
    closingPrice : new FormControl("", [Validators.required]),
    closingCateg : new FormControl("null", [Validators.required]),
    AdvPay : new FormControl("", [Validators.required]),
    remainingAmount : new FormControl("",[Validators.required]),
    custCity : new FormControl("", [Validators.required]),
    custState : new FormControl("", [Validators.required]),
    projectStatus : new FormControl("null",[Validators.required]),
    salesPerson : new FormControl("",[Validators.required]),
    remark  : new FormControl("",[Validators.required])
    
  })

  getControls(name: any) : AbstractControl | null{
    return this.customerForm.get(name)
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
