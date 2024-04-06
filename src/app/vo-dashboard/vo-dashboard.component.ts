import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-vo-dashboard',
  templateUrl: './vo-dashboard.component.html',
  styleUrls: ['./vo-dashboard.component.css']
})
export class VoDashboardComponent {
  data: any;

  constructor(private auth: AuthService){
    this.auth.voProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    })
  }
}
