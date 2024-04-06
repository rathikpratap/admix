import { Component, NgZone } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-script-update',
  templateUrl: './script-update.component.html',
  styleUrls: ['./script-update.component.css']
})
export class ScriptUpdateComponent {

  getId: any;
  tok: any;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    wordsCount: new FormControl(""),
    scriptDeliveryDate: new FormControl(""),
    script: new FormControl(""),
    scriptStatus: new FormControl("null", [Validators.required]),
    payment: new FormControl("")
  }) 

  constructor(private router: Router, private ngZone: NgZone,private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer){
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any)=>{

      this.updateForm.patchValue({
        custCode: res['custCode'],
        wordsCount: res['wordsCount'],
        scriptDeliveryDate: res['scriptDeliveryDate'],
        script: res['script'],
        payment: res['payment'],
        scriptStatus: res['scriptStatus']
      })
    })
 
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })

    this.auth.allEmployee().subscribe((res:any)=>{
      console.log("All Employees==>", res);
      
      res.forEach((employee: { signupUsername: string, signupPayment: string; }) => {
        if(employee.signupUsername === this.tok.signupUsername){
          console.log("Employee==>", employee.signupPayment)
          this.updateForm.get('payment')!.setValue(employee.signupPayment);
        }
      });
    })
  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate(){
    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res:any)=>{
      console.log("Data Updated Successfully", res);
      this.ngZone.run(()=> { this.router.navigateByUrl('/script-home/script-dashboard')})
    }, (err)=>{
      console.log(err)
    })
  }
}
