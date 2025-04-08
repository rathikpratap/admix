import { Component } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

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
  username = '';

  constructor(private auth:AuthService, private router:Router) {

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
    if (!data.loginUsername) return alert('Enter username');
  
    this.username = data.loginUsername;
  
    this.auth.sendOtp({ username: this.username }).subscribe((res: any) => {
      if (res.success) {
        this.otpSent = true;
        alert('OTP sent to your registered email!');
      } else {
        alert(res.message);
      }
    }, err => {
      alert('Failed to send OTP');
    });
  }

  // loginUser() {
  //   const loginData = this.loginForm.value as { loginUsername: string; loginPswd: string };
    
  //   this.auth.signin(loginData).subscribe((res: any) => {
  //     if (res.success) {
  //       localStorage.setItem('token', res.token);
  //       localStorage.setItem('roles', JSON.stringify(res.role)); // Store roles as a JSON string
  //       // Check for roles in the response
  //       const roles: string[] = res.role || [];
  //       const team = res.team;
  //       if (roles.includes('Admin') || roles.includes('Manager')) {
  //         this.router.navigateByUrl('/admin-dashboard');
  //       } else if (roles.includes('Sales Team')) {
  //         if (team === 'Shiva Development') {
  //           this.router.navigateByUrl('/salesHome/b2b-dashboard');
  //         } else {
  //           this.router.navigateByUrl('/salesHome/salesDashboard');
  //         }
  //       } else if (roles.includes('Script Writer')) {
  //         this.router.navigateByUrl('/script-home/script-dashboard');
  //       } else if (roles.includes('Editor')) {
  //         this.router.navigateByUrl('/editor-home/editor-dashboard');
  //       } else if (roles.includes('VO Artist')) {
  //         this.router.navigateByUrl('/vo-home/vo-dashboard');
  //       } else if (roles.includes('Graphic Designer')) {
  //         this.router.navigateByUrl('/graphic-home/graphic-dashboard');
  //       } else {
  //         alert('No matching role found!');
  //       }
  //     } else {
  //       alert(res.message);
  //     }
  //   }, err => {
  //     alert('Login Failed!');
  //   });
  // }

  loginUser() {
    const otp = this.otpForm.value.otp;
    if (!otp) return alert('Please enter OTP');
  
    this.auth.signin({ username: this.username, otp }).subscribe((res: any) => {
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('roles', JSON.stringify(res.role));
        const roles = res.role || [];
        const team = res.team;
  
        if (roles.includes('Admin') || roles.includes('Manager')) {
          this.router.navigateByUrl('/admin-dashboard');
        } else if (roles.includes('Sales Team')) {
          if (team === 'Shiva Development') {
            this.router.navigateByUrl('/salesHome/b2b-dashboard');
          } else {
            this.router.navigateByUrl('/salesHome/salesDashboard');
          }
        } else if (roles.includes('Script Writer')) {
          this.router.navigateByUrl('/script-home/script-dashboard');
        } else if (roles.includes('Editor')) {
          this.router.navigateByUrl('/editor-home/editor-dashboard');
        } else if (roles.includes('VO Artist')) {
          this.router.navigateByUrl('/vo-home/vo-dashboard');
        } else if (roles.includes('Graphic Designer')) {
          this.router.navigateByUrl('/graphic-home/graphic-dashboard');
        } else {
          alert('No matching role found!');
        }
      } else {
        alert(res.message);
      }
    }, err => {
      alert('Login Failed!');
    });
  }
}
