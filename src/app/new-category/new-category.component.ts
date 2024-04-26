import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent {
 
  tok:any;
  message:string ='';
  isProcess:boolean = false; 
  className = 'd-none'

  message1:string ='';
  isProcess1:boolean = false; 
  className1 = 'd-none'

  constructor(private auth:AuthService) {
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
  }
  
  categoryForm = new FormGroup({
    categoryName : new FormControl("")
  });

  salesTeamForm = new FormGroup({
    salesTeamName : new FormControl("")
  })

  categ(){
    this.isProcess = true;
    console.warn(this.categoryForm.value);
    const data = this.categoryForm.value;
    this.auth.newCategory(data).subscribe( res=>{
      if(res.success){
        this.isProcess = false;
        this.message = "Category has been Created!!";
        this.className = 'alert alert-success';
        this.categoryForm.reset();
      }else {
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
      }
      },err =>{
        this.isProcess = false;
        this.message = "Server Error";
        this.className = 'alert alert-danger';
    })
  }

  salesTeam(){
    this.isProcess = true;
    console.warn(this.salesTeamForm.value);
    const data = this.salesTeamForm.value;
    this.auth.newSalesTeam(data).subscribe( res=>{
      if(res.success){
        this.isProcess1 = false;
        this.message1 = "Sales Team has been Created!!";
        this.className1 = 'alert alert-success';
        this.salesTeamForm.reset();
      }else {
        this.isProcess1 = false;
        this.message1 = res.message;
        this.className1 = 'alert alert-danger';
      }
      },err =>{
        this.isProcess1 = false;
        this.message1 = "Server Error";
        this.className1 = 'alert alert-danger';
    })
  }
}
