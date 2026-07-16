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
  Category:any;

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
    });
    this.auth.getWhatsAppCategory().subscribe((category:any)=>{
      this.Category = category;
    });

  }
  leadForm = new FormGroup({
    campaign_Name: new FormControl("WhatsApp",[Validators.required]),
    closingDate: new FormControl(),
    custName: new FormControl("",[Validators.required]),
    custEmail: new FormControl(""),
    custBussiness: new FormControl(""),
    custNumb: new FormControl("",[Validators.required, Validators.pattern(this.integerRegex)]),
    state: new FormControl(""),
    salesTeam: new FormControl(""),
    leadsCreatedDate: new FormControl(""),
    salesPerson: new FormControl(""),
    companyName: new FormControl(""),
    projectStatus: new FormControl("Null"),
    remark: new FormControl(""),
    leadType: new FormControl("",[Validators.required]),
    leadDate: new FormControl("",[Validators.required])
  })
  getControls(name: any) : AbstractControl | null{
    return this.leadForm.get(name)
  }

  addLead(){
    const currentDate = new Date();
    // const modifiedDate = new Date(currentDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString();
    // this.leadForm.get('closingDate')?.setValue(modifiedDate);
    this.isProcess = true;
    console.warn(this.leadForm.value);
    const custData = this.leadForm.value;
    this.auth.addLead(custData).subscribe(res =>{
      if(res.success){
        this.isProcess = false;
        this.message = "New Lead Added";
        this.className = 'alert alert-success';
        this.leadForm.get('leadsCreatedDate')?.setValue(this.leadForm.get('closingDate')?.value || null);
        window.location.reload();
      }else{
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
        this.leadForm.reset();
      }
    },err =>{
      this.isProcess = false;
      this.message = "Server Error";
      this.className = 'alert alert-danger';
    })
  }
  showLeadDate = false;
  showLeadTypeSelection = true;

  checkLeadStatus(){
    const numberr = this.leadForm.get('custNumb')?.value;

    if(!numberr) return;

    this.auth.checkNumber(numberr).subscribe((res:any)=>{
      const latestLead = res.latestLead;

      this.showLeadDate = latestLead?.projectStatus === 'Closing';

      if(latestLead && latestLead.projectStatus !== 'Closing'){
        this.showLeadTypeSelection = false;

        this.leadForm.patchValue({
          leadType: 'Meta Forms'
        });
        this.leadForm.get('leadType')?.disable();
      } else {
        this.showLeadTypeSelection = true;
        this.leadForm.get('leadType')?.enable();

        this.leadForm.patchValue({
          leadType: ''
        });
      }
    });
  }
}
