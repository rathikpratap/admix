import { Component } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { SessionService } from '../service/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  userRole:any;
  tok:any;
  quote:any;
  otpSent = false;
  isAdmin = false;
  username = '';

  constructor(private auth:AuthService, private session: SessionService, private toastr: ToastrService) {

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data
    });
    this.auth.quotes().subscribe((res:any)=>{
      this.quote = res;
    });
  } 

  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPswd: new FormControl('')
  });

  otpForm = new FormGroup({
    otp: new FormControl('')
  });

  sendOtp() {
    const data = this.loginForm.value;
    if (!data.loginUsername || !data.loginPswd) {return alert('Enter username');}
  
    this.username = data.loginUsername;
    const password = data.loginPswd;
  
    this.auth.sendOtp({ username: this.username, password }).subscribe((res: any) => {
      if (res.success) {
        this.isAdmin = res.isAdmin;
        if(this.isAdmin){
          this.auth.signin({ username: this.username, password, otp: null}).subscribe((res: any) => {
            this.session.handleLoginResponse(res);
          }, err => {
            alert('Login Failed');
          });
        }else if (res.token) {
          this.session.handleLoginResponse(res);
        }else{
          this.otpSent = true;
          this.toastr.success("OTP sent to your registered email!", "Success");
        }
      } else {
        alert(res.message);
      }
    }, err => {
      alert('Failed to send OTP');
    });
  }

  loginUser() {
    const otp = this.otpForm.value.otp;
    const password = this.loginForm.value.loginPswd;
    if (!otp) return alert('Please enter OTP');
    if(!password) return alert('Please enter Password');
  
    this.auth.signin({ username: this.username, password, otp }).subscribe((res: any) => {
      this.session.handleLoginResponse(res);
    }, err => {
      alert('Login Failed!');
    });
  }
}
