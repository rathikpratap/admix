import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent {
 
  message:string ='';
  isProcess:boolean = false;
  className = 'd-none'

  constructor(private auth:AuthService) {}
  
  categoryForm = new FormGroup({
    categoryName : new FormControl("")
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
}
