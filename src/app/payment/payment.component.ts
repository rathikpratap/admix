import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  emp: any[]=[];

  constructor(private auth: AuthService){
    this.auth.allEmployee().subscribe((res: any)=>{
      this.emp = res;
    })
  }

  filterEmployeesByRole(role: string): any[] {
    switch (role) {
        case 'Script Writer': 
            return this.emp.filter((employee:any) => employee.signupRole === 'Script Writer');
        case 'Editor':
            return this.emp.filter((employee:any) => employee.signupRole === 'Editor');
        case 'VO Artist':
            return this.emp.filter((employee:any) => employee.signupRole === 'VO Artist');
        default:
            return []; // Return an empty array if no specific role is selected
    }
  }
}
