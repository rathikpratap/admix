import { Component, NgZone } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

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
  count: any;
  company: any;

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
    scriptDurationSeconds: new FormControl(0),
    companyName: new FormControl("")
  }) 

  constructor(private router: Router, private ngZone: NgZone,private activatedRoute: ActivatedRoute, private auth: AuthService){
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
        scriptDurationSeconds: res['scriptDurationSeconds'],
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
    });
  }

  getControls(name: any): AbstractControl | null {
    return this.updateForm.get(name)
  }

  onUpdate(){
    // console.log("duration==>",this.updateForm.get('scriptDurationSeconds')?.value);
    // const Minsec: number = this.updateForm.get('scriptDurationMinutes')?.value || 0;
    // const sec: number = this.updateForm.get('scriptDurationSeconds')?.value || 0;
    // this.totalSec = Minsec * 60 + sec;
    // this.updateForm.get('scriptDuration')?.setValue(this.totalSec);
    // console.log("Total Sec==>", this.totalSec);

    const CompName = this.updateForm.get('companyName')?.value;
    console.log("CompanyNAme==>", CompName);
    this.count = this.updateForm.get('wordsCount')?.value;

    this.company.forEach((comp: {companyName: string, signupName: string, payment150words: number, payment200words: number, payment300words: number, payment500words: number})=>{
      if(comp.companyName === 'AdmixMedia' && comp.signupName === this.tok.signupUsername){
        if(this.count > 0 && this.count <= 150){
          this.updateForm.get('scriptPayment')?.setValue(comp.payment150words);
        } else if(this.count > 150 && this.count <= 200){
          this.updateForm.get('scriptPayment')?.setValue(comp.payment200words);
        } else if(this.count > 200 && this.count <=300){
          this.updateForm.get('scriptPayment')?.setValue(comp.payment300words);
        } else if(this.count > 300 && this.count <=500){
          this.updateForm.get('scriptPayment')?.setValue(comp.payment500words);
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
