import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-script-projects',
  templateUrl: './script-projects.component.html',
  styleUrls: ['./script-projects.component.css']
})
export class ScriptProjectsComponent {
  data: any;
  tok:any;
  searchForm: FormGroup;
  customers :any[] = [];
  errorMessage: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.scriptProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    })
    this.searchForm = this.formBuilder.group({
      projectName: ['']
    });
  }
  searchCustomer(){
    const projectName = this.searchForm.get('projectName')!.value;
    console.log("NUMBER===>", projectName);
    this.auth.searchCustomerbyProjectName(projectName).subscribe((customers: any)=>{
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
