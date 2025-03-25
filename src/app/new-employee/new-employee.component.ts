import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html', 
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent {
  integerRegex = '^((\\+91-?)|0)?[0-9]{10}$';
  emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  visible:boolean = true;
  changetype:boolean = true;
  message:string ='';
  isProcess:boolean = false;
  className = 'd-none'
  team: any;
  tok:any;
  subsidiary:any;
 
  constructor(private auth:AuthService) {
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    }) 

    this.auth.getSalesTeam().subscribe((res:any)=>{
      this.team = res;
    });
    this.auth.getSubsidiary().subscribe((res:any)=>{
      this.subsidiary = res;
    })
  }

  registrationForm = new FormGroup({
    signupName : new FormControl("", [Validators.required]),
    signupUsername : new FormControl("", [Validators.required]),
    signupEmail : new FormControl("", [Validators.required, Validators.pattern(this.emailRegex)]),
    signupNumber : new FormControl("", [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.integerRegex)]),
    signupGender : new FormControl("Male",[Validators.required]),
    signupPassword : new FormControl("", [Validators.required, Validators.pattern(this.passwordRegex)]),
    signupAddress : new FormControl("",[Validators.required]),
    signupRole : new FormControl("Select Role",[Validators.required]),
    salesTeam : new FormControl("null"),
    subsidiaryName : new FormControl("null",[Validators.required]),
    incentivePassword : new FormControl("")
  })
  getControls(name: any) : AbstractControl | null{
    return this.registrationForm.get(name)
  }
  regis(){
    this.isProcess = true;
    console.warn(this.registrationForm.value);
    const data = this.registrationForm.value;
    this.auth.signup(data).subscribe( res=>{
      if(res.success){
        this.isProcess = false;
        this.message = "Account has been Created!!";
        this.className = 'alert alert-success';
      }else {
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

  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }
}
