import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fb-access-token',
  templateUrl: './fb-access-token.component.html',
  styleUrls: ['./fb-access-token.component.css']
})
export class FbAccessTokenComponent {

  tok: any;
  fbToken:any;
  message: string = '';
  isProcess: boolean = false;
  className = 'd-none';

  constructor(private auth: AuthService) {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.getfbToken().subscribe((res:any[])=>{
      this.fbToken = res[0];
      console.log("TOKEN==>", res)
    })
  }
  accessTokenForm = new FormGroup({
    newAccessToken : new FormControl(""),
    preAccessToken : new FormControl("")
  });
  token(){
    this.isProcess = true;
    console.warn(this.accessTokenForm.value);
    const data = this.accessTokenForm.value;
    this.auth.newfbToken(data).subscribe((res:any)=>{
      if(res.success){
        this.isProcess = false;
        this.message=res.message;
        this.className = 'alert alert-success';
      }
    },err=>{
      this.isProcess = false;
      this.message = "Server Error";
      this.className = 'alert alert-danger';
    })
  }
}
