import { Component } from '@angular/core';
import {AbstractControl,FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  constructor(private auth:AuthService, private router:Router) {}

  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPswd: new FormControl('')
  })
  loginUser(){
    const loginData = this.loginForm.value;
    this.auth.signin(loginData).subscribe((res)=>{
      if(res.success){ 
        localStorage.setItem('token', res.token);
        //alert(res.message);
        if(this.loginForm.value.loginUsername === 'Shiva Varshney' || this.loginForm.value.loginUsername === 'Swati Varshney'){
          this.router.navigateByUrl('/admin-dashboard')
        }else{
          this.router.navigateByUrl('/salesHome/salesDashboard')
        }
          
      }else{
        alert(res.message)
      }
      
    },err=>{
      alert("Login Failed!!")
    })
    console.warn(this.loginForm.value);
  }
}
