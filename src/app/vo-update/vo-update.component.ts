import { Component, NgZone } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    companyName: new FormControl(""),
    salesPerson: new FormControl("")
  }) 

  constructor(private router: Router, private ngZone: NgZone,private activatedRoute: ActivatedRoute, private auth: AuthService,private toastr: ToastrService){
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getCustomer(this.getId).subscribe((res: any)=>{

      this.updateForm.patchValue({
        custCode: res['custCode'],
        custBussiness: res['custBussiness'],
        voiceDuration: res['voiceDuration'],
        voiceDeliveryDate: this.formatDate(res['voiceDeliveryDate']),
        voiceOverType: res['voiceOverType'],
        voicePayment: res['voicePayment'],
        voiceOverStatus: res['voiceOverStatus'],
        voiceOtherChanges: res['voiceOtherChanges'],
        voiceChangesPayment: res['voiceChangesPayment'],
        totalVoicePayment: res['totalVoicePayment'],
        voiceDurationMinutes: res['voiceDurationMinutes'],
        voiceDurationSeconds: res['voiceDurationSeconds'],
        companyName: res['companyName'],
        salesPerson: res['salesPerson']
      })
    });

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });

    this.auth.allEmployee().subscribe((res:any)=>{
      this.emp = res;
    });
    
    this.auth.getCompany().subscribe((res:any)=>{
      this.company = res;
    });
  }
  formatDate(isoDate: string): string{
    if(!isoDate) return '';
    return isoDate.split('T')[0];
  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate(){
    const Minsec: number = this.updateForm.get('voiceDurationMinutes')?.value || 0;
    const sec: number = this.updateForm.get('voiceDurationSeconds')?.value || 0;
    this.totalSec = Minsec * 60 + sec;
    this.updateForm.get('voiceDuration')?.setValue(this.totalSec);
    const CompName = this.updateForm.get('companyName')?.value;

    this.company.forEach((comp: {companyName: string, signupName: string, payment60Sec: number, payment90Sec: number, payment120Sec: number, payment150Sec: number, payment180Sec: number})=>{
      if(comp.companyName === CompName && comp.signupName === this.tok.signupUsername){
        if(this.totalSec > 0 && this.totalSec <= 60){
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
      this.toastr.success('Data Updated Successfully','Success');
      const projectStatusControl = this.updateForm.get('voiceOverStatus');
        projectStatusControl?.valueChanges.subscribe(value => {
          if (value === 'Complete') {
            let selectedEmployee = this.emp.find((employee: any) => employee.signupRole === 'Admin');
            let sales = this.updateForm.get('salesPerson')?.value;
            let msgTitle = "Project Complete";
            let msgBody = `${this.updateForm.get('custBussiness')?.value} by Voice Over Artist`;
            this.auth.sendNotificationsAdmin([selectedEmployee],sales, msgTitle, msgBody, currentDate).subscribe((res: any) => {
              if (res) {
                this.toastr.success('Notification Send', 'Success');
              } else {
                this.toastr.error('Error Sending Notification', 'Error');
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