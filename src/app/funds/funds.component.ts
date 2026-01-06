import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.css']
})
export class FundsComponent implements OnInit{

  tok: any;
  funds: any[] = [];
  selectedMonth = new Date().toISOString().slice(0,7);
  accountTotals: any = {};
  grandTotal = 0;

  ngOnInit(): void{
    this.loadFunds();
  }

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
  }

  loadFunds(){
    const [year,month] = this.selectedMonth.split('-');

    this.auth.getMonthlyFunds(+year, +month).subscribe(res => {
      this.funds = res.data || [];
      console.log('FUNDS=====>>', this.funds);

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
