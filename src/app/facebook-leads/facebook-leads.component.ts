import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-facebook-leads',
  templateUrl: './facebook-leads.component.html',
  styleUrls: ['./facebook-leads.component.css']
})
export class FacebookLeadsComponent {
 
  data: any;
  data2: any;
  emp: any;

  constructor(private auth: AuthService){
    this.auth.fetchLeads().subscribe((res :any)=>{
      this.data2 = res;
    });

    this.auth.getLeads().subscribe((list : any)=>{
      console.log("list==>",list)
      this.data = list;
    });

    this.auth.allEmployee().subscribe((res : any)=>{
      console.log("employee==>", res);
      this.emp = res;
    })
  }

  getLeads(){
    this.auth.getLeads().subscribe((list : any)=>{
      console.log("list==>",list)
      this.data = list;
      console.log(list.campaign_name)
    })
  }
}
