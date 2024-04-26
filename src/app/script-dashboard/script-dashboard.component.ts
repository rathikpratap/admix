import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-script-dashboard',
  templateUrl: './script-dashboard.component.html',
  styleUrls: ['./script-dashboard.component.css']
})
export class ScriptDashboardComponent {

  data: any;
  tok:any;

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.scriptProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    })
  }
}
