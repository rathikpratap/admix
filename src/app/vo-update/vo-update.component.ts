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
  company: any;

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
    voiceDurationSeconds: new FormControl(0),
    companyName: new FormControl("")
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
        voiceDurationSeconds: res['voiceDurationSeconds'],
        companyName: res['companyName']
      })
    })

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })

    this.auth.allEmployee().subscribe((res:any)=>{
      console.log("All Employees==>", res);
      this.emp = res;
    });
    this.auth.getCompany().subscribe((res:any)=>{
      this.company = res;
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
    const CompName = this.updateForm.get('companyName')?.value;

    this.company.forEach((comp: {companyName: string, signupUsername: string, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number})=>{
      if(comp.companyName === 'AdmixMedia' && comp.signupUsername === this.tok.signupUsername){
        console.log("Payment Of employee===>>", comp.payment60Sec);
        if(this.totalSec > 0 && this.totalSec <= 60){
          console.log("60Sec Payment",comp.payment60Sec);
          this.updateForm.get('voicePayment')?.setValue(comp.payment60Sec);
        } else if(this.totalSec > 60 && this.totalSec <= 90){
          this.updateForm.get('voicePayment')?.setValue(comp.payment90Sec);
        } else if(this.totalSec > 90 && this.totalSec <=120){
          this.updateForm.get('voicePayment')?.setValue(comp.payment120Sec);
        } else if(this.totalSec > 120 && this.totalSec <=150){
          this.updateForm.get('voicePayment')?.setValue(comp.payment150Sec);
        } else if(this.totalSec > 150 && this.totalSec <=180){
          this.updateForm.get('voicePayment')?.setValue(comp.payment180Sec);
        } else{
          this.updateForm.get('voicePayment')?.setValue(0);
        }
      }
    })

    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res:any)=>{
      console.log("Data Updated Successfully", res);
      this.ngZone.run(()=> { this.router.navigateByUrl('/vo-home/vo-projects')})
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
