import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-custom-leads',
  templateUrl: './custom-leads.component.html',
  styleUrls: ['./custom-leads.component.css']
})
export class CustomLeadsComponent {
 
  message:string='';
  isProcess:boolean = false;
  className = 'd-none';
  tok:any;
  integerRegex = '^((\\+91-?)|0)?[0-9]{10}$';

  constructor(private auth: AuthService, private router: Router){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(this.tok){
        this.leadForm.get('salesPerson')!.setValue(this.tok.signupUsername);
        this.leadForm.get('salesTeam')!.setValue(this.tok.salesTeam);
      }else{
        alert("Session Expired, Please Login Again")
        this.router.navigate(['/login'])
      }
    });
    this.auth.getCompany().subscribe((res:any)=>{
      this.leadForm.get('companyName')?.setValue('AdmixMedia');
    });
    this.leadForm.valueChanges.subscribe(values=>{
      const dates= values.closingDate;
      this.leadForm.get('leadsCreatedDate')!.setValue(dates || null)
    })

  }
  leadForm = new FormGroup({
    campaign_Name: new FormControl("",[Validators.required]),
    closingDate: new FormControl("",[Validators.required]),
    custName: new FormControl("",[Validators.required]),
    custEmail: new FormControl(""),
    custBussiness: new FormControl(""),
    custNumb: new FormControl("",[Validators.required, Validators.pattern(this.integerRegex)]),
    state: new FormControl(""),
    salesTeam: new FormControl(""),
    leadsCreatedDate: new FormControl(""),
    salesPerson: new FormControl(""),
    companyName: new FormControl(""),
    projectStatus: new FormControl("null"),
    remark: new FormControl("")
  })
  getControls(name: any) : AbstractControl | null{
    return this.leadForm.get(name)
  }

  addLead(){

    this.isProcess = true;
    console.warn(this.leadForm.value);
    const custData = this.leadForm.value;
    this.auth.addLead(custData).subscribe(res =>{
      if(res.success){
        this.isProcess = false;
        this.message = "New Lead Added";
        this.className = 'alert alert-success';
        this.leadForm.get('leadsCreatedDate')?.setValue(this.leadForm.get('closingDate')?.value || null);
        this.leadForm.reset();
      }else{
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
      }
    },err =>{
      this.isProcess = false;
      this.message = "Server Error";
      this.className = 'alert alert-danger';
    })
  }
}
