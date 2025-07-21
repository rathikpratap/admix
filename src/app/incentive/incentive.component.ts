import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-incentive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './incentive.component.html',
  styleUrl: './incentive.component.css'
})
export class IncentiveComponent implements OnInit {
  
  incentiveForm : FormGroup;
  tok:any;
  emp: any;
  closing_names:any;
  className= 'd-none';
  message: string ='';
  isProcess: boolean = false;
  data: any;

  ngOnInit(): void { }

  constructor(private auth: AuthService, private fb: FormBuilder){

    this.incentiveForm = this.fb.group({
      employeeName : new FormControl(""),
      incentives: this.fb.array([])
    });

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.emp = res;
    });
    
    this.auth.getIncentive().subscribe((res:any)=>{
      this.data = res;
    });

    this.addIncentive();
  }

  get incentives(): FormArray {
    return this.incentiveForm.get('incentives') as FormArray;
  }

  addIncentive(){
    const incentiveGroup = this.fb.group({
      amount: [0],
      increment: [0]
    });
    this.incentives.push(incentiveGroup);
  }

  removeIncentive(index: number){
    if(this.incentives.length > 1){
      this.incentives.removeAt(index);
    }
  }

  createIncentiveField(previousAmount: number = 0): FormGroup {
    return this.fb.group({
      amount: new FormControl(previousAmount)
    });
  }

  // Add a new incentive field and set its label to the last entered amount
  addIncentiveField() {
    const lastAmount = this.incentives.at(this.incentives.length - 1).value.amount;
    this.incentives.push(this.createIncentiveField(lastAmount));
  }

  submitIncentive(){
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
    });
  }
}
