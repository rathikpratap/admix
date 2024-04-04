import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-team-leads',
  templateUrl: './team-leads.component.html',
  styleUrls: ['./team-leads.component.css']
})
export class TeamLeadsComponent {
 
  data:any; 
  dataLength:any;
  rangeData: any;
  searchForm: FormGroup;
  customers :any[] = [];
  errorMessage: any;
  tok: any;
  Category: any;
  emp: any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });

  updateButtonVisible: boolean = true;
   

  constructor(private auth: AuthService,private formBuilder: FormBuilder){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data.salesTeam;
      console.log("USerDAta==>", this.tok)
    })

    this.searchForm = this.formBuilder.group({
      projectStatus: ['']
    });

    this.auth.getTeamLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.data = res;
    });

    this.auth.dataLength().subscribe((res:any)=>{
      console.log("length==>", res);
      this.dataLength = res;
    });

    this.auth.getCategory().subscribe((category:any)=>{
      console.log("Categories===>>", category);
      this.Category = category;
    });

    this.auth.getSalesTeam().subscribe((res : any)=>{
      console.log("Sales Teams==>", res);
      this.emp = res;
    })
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getSalesLeadbyRange(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }

  searchCustomer(){
    const projectStatus = this.searchForm.get('projectStatus')!.value;
    this.auth.searchCustomerbyProject(projectStatus).subscribe((customers)=>{
      console.log("customer",customers)
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }

  updateProjectStatus(){ 
    this.auth.updateProjectStatus(this.data).subscribe(( res: any)=>{
      if(this.data){
        alert("Data Project Status Successfully Transfered");
        console.log("Project Status Updated Data", this.data);
      }
      
      console.log("SalesPerson Updated Successfully", res);
    })
  }
}
