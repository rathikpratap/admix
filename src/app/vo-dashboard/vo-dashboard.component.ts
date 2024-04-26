import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-vo-dashboard',
  templateUrl: './vo-dashboard.component.html',
  styleUrls: ['./vo-dashboard.component.css']
})
export class VoDashboardComponent {
  data: any;
  tok:any;

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.auth.voProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    })
  }
}
