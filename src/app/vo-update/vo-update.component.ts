import { Component, NgZone } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vo-update',
  templateUrl: './vo-update.component.html',
  styleUrls: ['./vo-update.component.css']
})
export class VoUpdateComponent {
  getId: any;
  tok: any;
  voiceOtherChanges: boolean = false;
  emp: any;
  totalSec: any;
  showVoicePayment: boolean = false;

  updateForm = new FormGroup({
    custCode: new FormControl("", [Validators.required]),
    voiceDuration: new FormControl(0),
    voiceDeliveryDate: new FormControl(""),
    voiceOverType: new FormControl(""),
    voiceOverStatus: new FormControl("null", [Validators.required]),
    voicePayment: new FormControl(),
    voiceOtherChanges: new FormControl(""),
    voiceChangesPayment: new FormControl(),
    totalVoicePayment: new FormControl(0),
    voiceDurationMinutes: new FormControl(0),
    voiceDurationSeconds: new FormControl(0)
  }) 

  constructor(private router: Router, private ngZone: NgZone,private activatedRoute: ActivatedRoute, private auth: AuthService, private sanitizer: DomSanitizer){
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any)=>{

      this.updateForm.patchValue({
        custCode: res['custCode'],
        voiceDuration: res['voiceDuration'],
        voiceDeliveryDate: res['voiceDeliveryDate'],
        voiceOverType: res['voiceOverType'],
        voicePayment: res['voicePayment'],
        voiceOverStatus: res['voiceOverStatus'],
        voiceOtherChanges: res['voiceOtherChanges'],
        voiceChangesPayment: res['voiceChangesPayment'],
        totalVoicePayment: res['totalVoicePayment'],
        voiceDurationMinutes: res['voiceDurationMinutes'],
        voiceDurationSeconds: res['voiceDurationSeconds']
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
    console.log("duration==>",this.updateForm.get('voiceDurationSeconds')?.value);
    const Minsec: number = this.updateForm.get('voiceDurationMinutes')?.value || 0;
    const sec: number = this.updateForm.get('voiceDurationSeconds')?.value || 0;
    this.totalSec = Minsec * 60 + sec;
    this.updateForm.get('voiceDuration')?.setValue(this.totalSec);
    console.log("Total Sec==>", this.totalSec);

    this.emp.forEach((employee: {signupUsername: string, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number})=>{
      if(employee.signupUsername === this.tok.signupUsername){
        console.log("Payment Of employee===>>", employee.payment60Sec);
        if(this.totalSec > 0 && this.totalSec <= 60){
          console.log("60Sec Payment",employee.payment60Sec);
          this.updateForm.get('voicePayment')?.setValue(employee.payment60Sec);
        } else if(this.totalSec > 60 && this.totalSec <= 90){
          this.updateForm.get('voicePayment')?.setValue(employee.payment90Sec);
        } else if(this.totalSec > 90 && this.totalSec <=120){
          this.updateForm.get('voicePayment')?.setValue(employee.payment120Sec);
        } else if(this.totalSec > 120 && this.totalSec <=150){
          this.updateForm.get('voicePayment')?.setValue(employee.payment150Sec);
        } else if(this.totalSec > 150 && this.totalSec <=180){
          this.updateForm.get('voicePayment')?.setValue(employee.payment180Sec);
        } else{
          this.updateForm.get('voicePayment')?.setValue(0);
        }
      }
    })

    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res:any)=>{
      console.log("Data Updated Successfully", res);
      this.ngZone.run(()=> { this.router.navigateByUrl('/vo-home/vo-dashboard')})
    }, (err)=>{
      console.log(err)
    })
  }
  onChange(event: any) {
    if (event.target.value === 'yes') {
      this.voiceOtherChanges = true;
    } else {
      this.voiceOtherChanges = false;
    }
  }
}
