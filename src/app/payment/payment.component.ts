import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  emp: any[]=[];
  tok:any;
  companies:any;
 
  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.allEmployee().subscribe((res: any)=>{
      this.emp = res;
    });

    this.auth.getCompany().subscribe((res:any)=>{
      this.companies = res;
    });
  }

  filterEmployeesByRole(role: string): any[] {
    switch (role) {
        case 'Script Writer': 
            return this.companies.filter((employee:any) => employee.signupRole === 'Script Writer');
        case 'EditorAndVo':
            return this.companies.filter((employee:any) => employee.signupRole === 'Editor' || employee.signupRole === 'VO Artist');
        default:
            return []; // Return an empty array if no specific role is selected
    }
  }
}
