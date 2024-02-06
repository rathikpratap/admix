import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent {

    getId:any;
    
    updateForm = new FormGroup({
      custCode : new FormControl("", [Validators.required]),
      custName : new FormControl("", [Validators.required]),
      custNumb : new FormControl("", [Validators.required]),
      custBussiness : new FormControl("", [Validators.required]),
      closingDate : new FormControl("", [Validators.required]),
      closingPrice : new FormControl("", [Validators.required]),
      closingCateg : new FormControl("", [Validators.required]),
      AdvPay : new FormControl("", [Validators.required]),
      remainingAmount: new FormControl(""),
      custCity : new FormControl("", [Validators.required]),
      custState : new FormControl("", [Validators.required]),
      projectStatus : new FormControl("",[Validators.required]),
      salesPerson : new FormControl("",[Validators.required])
    })


    constructor(private router:Router, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private auth:AuthService ){
      this.getId = this.activatedRoute.snapshot.paramMap.get('id');
      this.auth.getCustomer(this.getId).subscribe((res: any)=>{
        console.log("res ==>",res);
        
        this.updateForm.patchValue({
          custCode : res['custCode'],
          custName : res['custName'],
          custNumb : res['custNumb'],
          custBussiness : res['custBussiness'],
          closingDate : res['closingDate'],
          closingPrice : res['closingPrice'],
          closingCateg : res['closingCateg'],
          AdvPay : res['AdvPay'],
          custCity : res['custCity'],
          custState : res['custState'],
          projectStatus : res['projectStatus'],
          salesPerson :res['salesPerson']
        })

      });
      
    }

    

    getControls(name: any) : AbstractControl | null{
      return this.updateForm.get(name)
    }

    onUpdate(){
      this.auth.updateCustomer(this.getId, this.updateForm.value).subscribe((res : any)=>{
        console.log("Data Updated Successfully");
        this.ngZone.run(()=>{this.router.navigateByUrl('/salesHome/salesDashboard')})
      },(err)=>{
        console.log(err)
      })
    }
}
