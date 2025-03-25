import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-incentive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-incentive.component.html',
  styleUrl: './sales-incentive.component.css'
})
export class SalesIncentiveComponent implements OnInit {

  tok:any;
  result:any[]=[];
  pass: any;
  month: number;
  year: number;
  monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  errorMessage: string = '';

  ngOnInit(): void {
    this.pass = prompt("Enter Password");
    this.fetchIncentive();
  }
  

  constructor(private auth: AuthService, private toastr: ToastrService){
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
    this.result = [];
    if (this.pass != null) {
      this.auth.salesIncentive(this.pass,this.year, this.month).subscribe(
        (res: any) => {
          if (res.message === 'Password Not Matched') {
            // Display error message if the password doesn't match
            this.toastr.error("Password is incorrect. Please try again.", "Error");
          }else if (res.message === 'No sales entries found for the current month') {
            this.result = []; // Ensure no old data is shown
            this.toastr.info("No data available for this month.", "Info");
        } else {
            // Handle success scenario
            this.toastr.success("Incentive data retrieved successfully.", "Success");
            this.result = res;
            console.log('MESSAGE====>>', res.message);
          }
        },
        (error) => {
          console.error("Error:", error);
          this.toastr.error("An error occurred while fetching data.", "Error");
        }
      );
    } else {
      this.toastr.error("Please enter a password.", "Error");
    }
  }
  prevMonth():void{
    if(this.month === 1){
      this.month = 12;
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
}