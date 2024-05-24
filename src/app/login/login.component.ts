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
  constructor(private auth:AuthService, private router:Router) {

    this.auth.getProfile().subscribe((res:any)=>{
      console.log("Token===>", res)
      this.tok = res?.data
    });
    this.auth.quotes().subscribe((res:any)=>{
      console.log("QUOTES===> ", res);
      this.quote = res;
    })
    
  } 

  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPswd: new FormControl('')
  }) 

  loginUser(){
    const loginData = this.loginForm.value as {loginUsername: string, loginPswd: string};
    this.auth.signin(loginData).subscribe((res:any)=>{
      if(res.success){
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        
        if (res.role === 'Admin' || res.role === 'Manager'){
          this.router.navigateByUrl('/admin-dashboard');
        } else if(res.role === 'Sales Team' && res.team !== 'Shiva Development'){
          this.router.navigateByUrl('/salesHome/salesDashboard');
        }else if(res.role === 'Sales Team' && res.team === 'Shiva Development'){
          this.router.navigateByUrl('/salesHome/b2b-dashboard');
        }else if(res.role === 'Script Writer'){
          this.router.navigateByUrl('/script-home/script-dashboard');
        }else if(res.role === 'Editor'){
          this.router.navigateByUrl('/editor-home/editor-dashboard');
        }else if(res.role === 'VO Artist'){
          this.router.navigateByUrl('/vo-home/vo-dashboard');
        }
      } else{
        alert(res.message);
      }
    }, err => {
      alert('Login Failed!');
    });
  }
}
