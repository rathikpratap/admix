import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-incentive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incentive.component.html',
  styleUrl: './incentive.component.css'
})
export class IncentiveComponent {
  
  tok:any;
  emp: any;
  closing_names:any;
  options: number[] = [];
  className= 'd-none';
  message: string ='';
  isProcess: boolean = false;
  data: any;

  incentiveForm = new FormGroup({
    employeeName : new FormControl(""),
    category : new FormControl(""),
    amountOne : new FormControl(0),
    amountOneIncrement: new FormControl(),
    amountTwo: new FormControl(0),
    amountTwoIncrement: new FormControl(),
    amountThree: new FormControl(0),
    amountThreeIncrement: new FormControl()
  });

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.emp = res;
      console.log("EMPLOYEE===>>", this.emp);
    });
    this.auth.getClosing().subscribe((res:any)=>{
      this.closing_names = res.filter((closing:any, index: number, self: any[])=>
      index === self.findIndex((clo:any)=> clo.closingCateg === closing.closingCateg));
    });
    for (let i = 10000; i <= 200000; i += 10000) {
      this.options.push(i);
    };
    this.auth.getIncentive().subscribe((res:any)=>{
      this.data = res;
    })
  }

  addIncentive(){
    this.isProcess = true;
    const incentiveData = this.incentiveForm.value;
    this.auth.addIncentive(incentiveData).subscribe((res:any)=>{
      if(res.success){
        this.isProcess = false;
      this.message = "Incentive Added";
      this.className = 'alert alert-success';
      this.incentiveForm.reset();
      }else{
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
      }
    },err=>{
      this.isProcess = false;
      this.message = 'Server Error';
      this.className = 'alert alert-danger';
    })
  }
}
