import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-incentive-calculation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incentive-calculation.component.html',
  styleUrl: './incentive-calculation.component.css'
})
export class IncentiveCalculationComponent {

  tok: any;
  groupedData:any={};

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.allEmpIncentive().subscribe((res:any)=>{
      res.forEach((result:any)=>{
        const emp = result._id.salesPerson;

        if(!this.groupedData[emp]){
          this.groupedData[emp] = [];
        }
        this.groupedData[emp].push(result);
      });
      // this.incentiveResult = res;
      // console.log("DATA====>", this.incentiveResult);
    });
  }
  objectKeys(obj: any) {
    return Object.keys(obj);
  }
}
