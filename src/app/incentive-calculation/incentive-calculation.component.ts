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
  fetchIncentive() {
    this.groupedData = {};
    this.auth.allEmpIncentive(this.year, this.month).subscribe(
      (res: any) => {
        res.forEach((result: any) => {
          // Ensure the result and the salesPerson field exist
          if (result && result.salesPerson) {
            const emp = result.salesPerson;
            // Initialize the employee's array if not already present
            if (!this.groupedData[emp]) {
              this.groupedData[emp] = [];
            }
            // Add the result to the grouped data
            this.groupedData[emp].push(result);
          } else {
            console.warn('Invalid result format:', result); // Warn about invalid entries
          }
        });
      },
      (error) => {
        console.error('Error fetching incentives:', error); // Handle errors gracefully
      }
    );
  }
  
  isEmptyGroupedData(): boolean {
    return Object.keys(this.groupedData).length === 0;
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
}