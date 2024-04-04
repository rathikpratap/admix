import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-script-dashboard',
  templateUrl: './script-dashboard.component.html',
  styleUrls: ['./script-dashboard.component.css']
})
export class ScriptDashboardComponent {

  data: any;

  constructor(private auth: AuthService){
    this.auth.scriptProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    })
  }
}
