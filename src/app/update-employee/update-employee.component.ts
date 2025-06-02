import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
}) 
export class UpdateEmployeeComponent {

  getId:any;
  team:any;
  tok:any;
  subsidiary:any;

  empUpdateForm = new FormGroup({
    signupName: new FormControl("",[Validators.required]),
    signupUsername: new FormControl("",[Validators.required]),
    signupEmail: new FormControl("", [Validators.required]),
    signupNumber : new FormControl("", [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
    signupGender : new FormControl("",[Validators.required]),
    signupPassword : new FormControl("", [Validators.required]),
    signupAddress : new FormControl("",[Validators.required]),
    signupRole : new FormControl("",[Validators.required]),
    signupPayment: new FormControl(""),
    salesTeam : new FormControl(""),
    subsidiaryName: new FormControl(""),
    incentivePassword : new FormControl(""),
    editorType : new FormControl("")
  });

  constructor(private router:Router, private ngZone:NgZone, private activatedRoute: ActivatedRoute, private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.auth.getEmployee(this.getId).subscribe((res: any)=>{
      this.empUpdateForm.patchValue({
        signupName : res['signupName'],
        signupUsername : res['signupUsername'],
        signupEmail : res['signupEmail'],
        signupNumber : res['signupNumber'],
        signupGender : res['signupGender'],
        signupPassword : res['signupPassword'],
        signupAddress : res['signupAddress'],
        signupRole : res['signupRole'],
        signupPayment: res['signupPayment'],
        salesTeam: res['salesTeam'],
        subsidiaryName: res['subsidiaryName'],
        incentivePassword: res['incentivePassword'],
        editorType: res['editorType']
      })
    });
    this.auth.getSalesTeam().subscribe((res:any)=>{
      this.team = res;
    });
    this.auth.getSubsidiary().subscribe((res:any)=>{
      this.subsidiary = res;
    });
  }

  getControls(name: any) : AbstractControl | null{
    return this.empUpdateForm.get(name)
  }

  onUpdate(){
    this.auth.updateEmployee(this.getId, this.empUpdateForm.value).subscribe((res:any)=>{
      this.ngZone.run(()=>{this.router.navigateByUrl('/allEmployees')})
    },(err)=>{
      console.log(err)
    });
  }
}