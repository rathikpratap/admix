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
  scriptOtherChanges: boolean = false;
  emp: any;
  totalSec: any;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    wordsCount: new FormControl(""),
    scriptDuration: new FormControl(0),
    scriptDeliveryDate: new FormControl(""),
    script: new FormControl(""),
    scriptStatus: new FormControl("null", [Validators.required]),
    scriptPayment: new FormControl(),
    scriptOtherChanges: new FormControl(""),
    scriptChangesPayment: new FormControl(),
    totalScriptPayment: new FormControl(0),
    scriptDurationMinutes: new FormControl(0),
    scriptDurationSeconds: new FormControl(0)
  }) 

  constructor(private router: Router, private ngZone: NgZone,private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer){
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any)=>{

      this.updateForm.patchValue({
        custCode: res['custCode'],
        wordsCount: res['wordsCount'],
        scriptDuration: res['scriptDuration'],
        scriptDeliveryDate: res['scriptDeliveryDate'],
        script: res['script'],
        scriptPayment: res['scriptPayment'],
        scriptStatus: res['scriptStatus'],
        scriptOtherChanges: res['scriptOtherChanges'],
        scriptChangesPayment: res['scriptChangesPayment'],
        totalScriptPayment: res['totalScriptPayment'],
        scriptDurationMinutes: res['scriptDurationMinutes'],
        scriptDurationSeconds: res['scriptDurationSeconds']
      })
    })
 
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })

    this.auth.allEmployee().subscribe((res:any)=>{
      console.log("All Employees==>", res);
      this.emp = res;
    })
  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate(){
    console.log("duration==>",this.updateForm.get('scriptDurationSeconds')?.value);
    const Minsec: number = this.updateForm.get('scriptDurationMinutes')?.value || 0;
    const sec: number = this.updateForm.get('scriptDurationSeconds')?.value || 0;
    this.totalSec = Minsec * 60 + sec;
    this.updateForm.get('scriptDuration')?.setValue(this.totalSec);
    console.log("Total Sec==>", this.totalSec);

    this.emp.forEach((employee: {signupUsername: string, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number})=>{
      if(employee.signupUsername === this.tok.signupUsername){
        console.log("Payment Of employee===>>", employee.payment60Sec);
        if(this.totalSec > 0 && this.totalSec <= 60){
          console.log("60Sec Payment",employee.payment60Sec);
          this.updateForm.get('scriptPayment')?.setValue(employee.payment60Sec);
        } else if(this.totalSec > 60 && this.totalSec <= 90){
          this.updateForm.get('scriptPayment')?.setValue(employee.payment90Sec);
        } else if(this.totalSec > 90 && this.totalSec <=120){
          this.updateForm.get('scriptPayment')?.setValue(employee.payment120Sec);
        } else if(this.totalSec > 120 && this.totalSec <=150){
          this.updateForm.get('scriptPayment')?.setValue(employee.payment150Sec);
        } else if(this.totalSec > 150 && this.totalSec <=180){
          this.updateForm.get('scriptPayment')?.setValue(employee.payment180Sec);
        } else {
          this.updateForm.get('scriptPayment')?.setValue(0);
        }
      } 
    })

    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res:any)=>{
      console.log("Data Updated Successfully", res);
      this.ngZone.run(()=> { this.router.navigateByUrl('/script-home/script-dashboard')})
    }, (err)=>{
      console.log(err)
    })
  }
  onChange(event: any) {
    if (event.target.value === 'yes') {
      this.scriptOtherChanges = true;
    } else {
      this.scriptOtherChanges = false; 
    }
  }
}
