import { Component} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.component.html',
  styleUrls: ['./update-payment.component.css']
})
export class UpdatePaymentComponent {

  getId:any;
  tok:any;
  companies:any;
  employee:any[] = [];
  selectedEmployee:any  = null; // To store the selected employee

  empUpdateForm = new FormGroup({
    companyName: new FormControl(null),
    signupName: new FormControl(""),
    signupRole: new FormControl(""),
    payment60Sec: new FormControl(0),
    payment90Sec: new FormControl(0),
    payment120Sec: new FormControl(0),
    payment150Sec: new FormControl(0),
    payment180Sec: new FormControl(0), 
    paymentTwoVideo: new FormControl(0),
    paymentThreeVideo: new FormControl(0),
    payment150words: new FormControl(0),
    payment200words: new FormControl(0),
    payment300words: new FormControl(0),
    payment500words: new FormControl(0),
  })

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.getCompany().subscribe((res:any)=>{
      this.companies = res.filter((company: any, index: number, self: any[]) =>
        index === self.findIndex((c: any) => c.companyName === company.companyName)
      );
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.employee = res;
      console.log("Emp===>", this.employee);
    })
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    
    this.auth.getCompanyPay(this.getId).subscribe((res:any)=>{
      console.log("res====>", res);
      this.empUpdateForm.patchValue({
        companyName : res['companyName'],
        signupName : res['signupName'],
        signupRole : res['signupRole'],
        payment60Sec: res['payment60Sec'],
        payment90Sec: res['payment90Sec'],
        payment120Sec: res['payment120Sec'],
        payment150Sec: res['payment150Sec'],
        payment180Sec: res['payment180Sec'],
        paymentTwoVideo: res['paymentTwoVideo'],
        paymentThreeVideo: res['paymentThreeVideo'],
        payment150words: res['payment150words'],
        payment200words: res['payment200words'],
        payment300words: res['payment300words'],
        payment500words: res['payment500words']
      })
    })
    
  }

  onUpdate(){
    const companyName = this.empUpdateForm.get('companyName')?.value; // Accessing companyName using get method
    const signupName = this.empUpdateForm.get('signupName')?.value;
    this.auth.updatePayment(companyName, signupName, this.empUpdateForm.value).subscribe((res:any)=>{
      console.log("Payment Update Successfully", this.empUpdateForm.value);
    },(err)=>{
      console.log(err)
    })
  }
  
  onChange(event: any) {
    const selectedIndex = event.target.selectedIndex;
    this.selectedEmployee = selectedIndex !== 0 ? this.employee[selectedIndex - 1] : null;
    this.empUpdateForm.get('signupRole')?.setValue(this.selectedEmployee.signupRole);
  }

}
