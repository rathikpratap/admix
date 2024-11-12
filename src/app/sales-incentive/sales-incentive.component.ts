import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  ngOnInit(): void {
    this.pass = prompt("Enter Password");
    if (this.pass != null) {
      this.auth.salesIncentive(this.pass).subscribe(
        (res: any) => {
          if (res.message === 'Password Not Matched') {
            // Display error message if the password doesn't match
            this.toastr.error("Password is incorrect. Please try again.", "Error");
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
  

  constructor(private auth: AuthService, private toastr: ToastrService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    // this.auth.salesIncentive().subscribe((res:any)=>{
    //   this.result = res;
    // });
  }
}
