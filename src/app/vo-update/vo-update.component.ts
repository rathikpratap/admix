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
    custBussiness: new FormControl(""),
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
        custBussiness: res['custBussiness'],
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

    this.company.forEach((comp: {companyName: string, signupName: string, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number})=>{
      if(comp.companyName === CompName && comp.signupName === this.tok.signupUsername){
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

    const voicePayment1: number = this.updateForm.get('voicePayment')?.value;
    const voiceChangesPayment1: number = this.updateForm.get('voiceChangesPayment')?.value;
    const totalVoicePayment1: number = voicePayment1 + voiceChangesPayment1;
    this.updateForm.get('totalVoicePayment')?.setValue(totalVoicePayment1);

    const currentDate = new Date().toISOString();

    this.auth.updateCustomerbyEditor(this.getId, this.updateForm.value).subscribe((res:any)=>{
      console.log("Data Updated Successfully", res);

      const projectStatusControl = this.updateForm.get('voiceOverStatus');
        projectStatusControl?.valueChanges.subscribe(value => {
          if (value === 'Complete') {
            let selectedEmployee = this.emp.find((employee: any) => employee.signupRole === 'Admin');
            console.log("SELECTED EMPLOYEE===>", selectedEmployee);
            let msgTitle = "Project Complete";
            let msgBody = `${this.updateForm.get('custBussiness')?.value} by ${this.tok.signupUsername}`;
            this.auth.sendNotification([selectedEmployee], msgTitle, msgBody, currentDate).subscribe((res: any) => {
              if (res) {
                alert("Notification Sent");
              } else {
                alert("Error Sending Notification");
              }
            });
          }
        });

        // Manually trigger the value change logic for projectStatus
        projectStatusControl?.setValue(projectStatusControl.value, { emitEvent: true });

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
      this.updateForm.get('voiceChangesPayment')?.setValue(0);
    }
  }
}
