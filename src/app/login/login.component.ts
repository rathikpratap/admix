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
  tok:any
  constructor(private auth:AuthService, private router:Router) {

    this.auth.getProfile().subscribe((res:any)=>{
      console.log("Token===>", res)
      this.tok = res?.data
    })
    
  }

  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPswd: new FormControl('')
  }) 
  loginUser(){
    const loginData = this.loginForm.value;
    this.auth.signin(loginData).subscribe((res:any)=>{
      if(res.success){ 
        localStorage.setItem('token', res.token);
        //alert(res.message);
         if(this.loginForm.value.loginUsername === 'Shiva Varshney' || this.loginForm.value.loginUsername === 'Swati Varshney'){
           this.router.navigateByUrl('/admin-dashboard')
         }else{
           this.router.navigateByUrl('/salesHome/salesDashboard')
         }

        // if(this.tok && this.tok.signupRole === 'Admin'){
        //  this.router.navigateByUrl('/admin-dashboard')
        // } else if(this.tok && this.tok.signupRole === 'Sales Team'){
        //  this.router.navigateByUrl('/salesHome/salesDashboard')
        // } else if(this.tok && this.tok.signupRole === 'Editor'){
        //   this.router.navigateByUrl('/ediotr-home/editor-dashboard')
        // } else if(this.tok && this.tok.signupRole === 'Script'){
        //   this.router.navigateByUrl('/script-home/script-dashboard')
        // } else if(this.tok && this.tok.signupRole == 'Vo Artist'){
        //   this.router.navigateByUrl('/vo-home/vo-dashboard')
        // }

        // if(this.tok){
        //   switch (this.tok.signupRole){
        //     case 'Admin':
        //       this.router.navigateByUrl('/admin-dashboard');
        //       break;
        //     case 'Sales Team':
        //       this.router.navigateByUrl('/salesHome/salesDashboard');
        //       break;
        //     case 'Editor':
        //       this.router.navigateByUrl('/editor-home/editor-dashboard');
        //       break;
        //     case 'Script Writer':
        //       this.router.navigateByUrl('/script-home/script-dashboard');
        //       break;
        //     case 'VO Artist':
        //       this.router.navigateByUrl('/vo-home/vo-dashboard');
        //       break;
        //     default:
        //       this.router.navigateByUrl('/login'); // You might want to handle default route differently
        //       break;
        //   }
        // }
          
      }else{
        alert(res.message)
      }
      
    },err=>{
      alert("Login Failed!!")
    })
    console.warn(this.loginForm.value);
  }
}
