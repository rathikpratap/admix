import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manage-funds',
  templateUrl: './manage-funds.component.html',
  styleUrl: './manage-funds.component.css'
})
export class ManageFundsComponent implements OnInit {

  message: string='';
  isProcess:boolean = false;
  className = 'd-none';
  tok: any;
  funds: any[] =[];
  accountTotals: any ={};
  grandTotal = 0;
  selectedMonth = new Date().toISOString().slice(0,7);

  ngOnInit(): void {
    this.loadFunds();
  }

  constructor(private auth: AuthService, private router: Router){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
  }
  fundForm = new FormGroup({
    fbAccount: new FormControl("null"),
    amount: new FormControl(),
    fundDate: new FormControl("",[Validators.required]) 
  });

  getControls(name: any): AbstractControl | null {
    return this.fundForm.get(name)
  }

  addFund(){
    // const currentDate = new Date();
    // this.fundForm.get('fundDate')?.setValue(currentDate);
    this.isProcess = true;
    console.warn(this.fundForm.value);
    const fundData = this.fundForm.value;
    this.auth.addFund(fundData).subscribe(res =>{
      if(res.success){
        this.isProcess = false;
        this.message = "Today's fund Added";
        this.className = 'alert alert-success';
        this.fundForm.reset();
      }else{
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
        this.fundForm.reset();
      }
    },err =>{
      this.isProcess = false;
      this.message = "Server Error";
      this.className = 'alert alert-danger';
    })
  }

  loadFunds(){
    const [year,month] = this.selectedMonth.split('-');

    this.auth.getMonthlyFunds(+year, +month).subscribe(res => {
      this.funds = res.data || [];
      
      this.accountTotals = {};
      this.grandTotal = 0;

      this.funds.forEach(f => {
        if(!this.accountTotals[f.fbAccount]){
          this.accountTotals[f.fbAccount] = 0;
        }
        this.accountTotals[f.fbAccount] += f.amount || 0;
        this.grandTotal += f.amount || 0;
      });
    });
  }
  getAccounts(){
    return Object.keys(this.accountTotals);
  }
}
