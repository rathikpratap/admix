import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-incentive-calculation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incentive-calculation.component.html',
  styleUrl: './incentive-calculation.component.css'
})
export class IncentiveCalculationComponent implements OnInit{

  tok: any;
  groupedData:any={};
  month: number;
  year: number;
  monthNames = ["January", "February", "March","April","May","June","July","August","September","October","November","December"];
  errorMessage: string = '';

  ngOnInit(): void {
    this.fetchIncentive();
  }

  constructor(private auth: AuthService){
    const today = new Date();
    this.month = today.getMonth()+1;
    this.year = today.getFullYear();
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
  }
  fetchIncentive(){
    this.groupedData = {};
    this.auth.allEmpIncentive(this.year, this.month).subscribe((res:any)=>{
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
  prevMonth():void{
    if(this.month === 1){
      this.month =12;
      this.year--;
    }else{
      this.month--;
    }
    this.fetchIncentive();
  }
  nextMonth(){
    if(this.month === 12){
      this.month = 1;
      this.year++;
    }else{
      this.month++;
    }
    this.fetchIncentive();
  }
  objectKeys(obj: any) {
    return Object.keys(obj);
  }
  get isEmptyGroupedData() {
    return !this.groupedData || Object.keys(this.groupedData).length === 0;
  }
  
}
