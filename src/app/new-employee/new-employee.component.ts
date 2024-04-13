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
 
  constructor(private auth:AuthService) {

    this.auth.getSalesTeam().subscribe((res:any)=>{
      this.team = res;
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
    signupPayment : new FormControl(""),
    salesTeam : new FormControl("null")
    //signupID: new FormControl("",[Validators.required])
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
