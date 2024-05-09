import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent {

  tok: any;
  message: string = '';
  isProcess: boolean = false;
  className = 'd-none';
  companies:any;

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.auth.getCompany().subscribe((res:any)=>{
      this.companies = res;
      console.log("Companies===>", this.companies);
    })
  }
  companyForm = new FormGroup({
    companyName : new FormControl("")
  });
  company(){
    this.isProcess = true;
    console.warn(this.companyForm.value);
    const data = this.companyForm.value;
    this.auth.addCompany(data).subscribe((res:any)=>{
      if(res.success){
        this.isProcess = false;
        this.message=res.message;
        this.className = 'alert alert-success';
      }
    },err=>{
      this.isProcess = false;
      this.message = "Server Error";
      this.className = 'alert alert-danger';
    })
  }
  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteCompany(id).subscribe((res : any)=>{
        this.companies.splice(i,1);
      })
    }
  }
}
