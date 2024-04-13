import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.component.html',
  styleUrls: ['./update-payment.component.css']
})
export class UpdatePaymentComponent {

  getId:any;

  empUpdateForm = new FormGroup({
    signupName: new FormControl(""),
    payment60Sec: new FormControl(0),
    payment90Sec: new FormControl(0),
    payment120Sec: new FormControl(0),
    payment150Sec: new FormControl(0),
    payment180Sec: new FormControl(0), 
  })

  constructor(private router:Router, private ngZone:NgZone, private activatedRoute: ActivatedRoute, private auth: AuthService){
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getEmployee(this.getId).subscribe((res: any)=>{
      console.log("res ==>", res);
      this.empUpdateForm.patchValue({
        signupName : res['signupName'],
        payment60Sec: res['payment60Sec'],
         payment90Sec: res['payment90Sec'],
         payment120Sec: res['payment120Sec'],
         payment150Sec: res['payment150Sec'],
         payment180Sec: res['payment180Sec']
      })
    });
  }

  

  onUpdate(){
    this.auth.updateEmployee(this.getId, this.empUpdateForm.value).subscribe((res:any)=>{
      console.log("Payment Updated Successfully");
      this.ngZone.run(()=>{this.router.navigateByUrl('/payment')})
    },(err)=>{
      console.log(err)
    })
  }

}
