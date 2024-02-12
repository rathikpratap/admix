import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent {
 
  data:any=[];
  searchForm: FormGroup;
  customers :any[] = [];
  errorMessage: any;
 
  constructor(private auth: AuthService, private formBuilder: FormBuilder){
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });

    this.auth.allProjects().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
    })
  }

  searchCustomer(){
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobile(mobile).subscribe((customers)=>{
      console.log("customer",customers)
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }


}
