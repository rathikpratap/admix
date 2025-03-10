import { Component} from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-leads',
  templateUrl: './sales-leads.component.html',
  styleUrls: ['./sales-leads.component.css'] 
})
export class SalesLeadsComponent {

  tok:any;
  data:any; 
  dataLength:any;
  rangeData: any;
  searchForm: FormGroup;
  customers :any[] = [];
  projects: any[] = [];
  errorMessage: any;
  previousMonthName: string;
  previousTwoMonthName: string;
  currentMonthName: string;
  
  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
 

  constructor(private auth: AuthService,private formBuilder: FormBuilder){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })

    this.searchForm = this.formBuilder.group({
      //projectStatus: ['']
      mobile: ['']
    });

    this.auth.getSalesLeads().subscribe((res:any)=>{
      console.log("SalesLeads===>", res);
      this.data = res;
    })

    this.auth.dataLength().subscribe((res:any)=>{
      console.log("length==>", res);
      this.dataLength = res; 
    })

    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getSalesLeadbyRangeSales(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }

  // searchProject(){
  //   const projectStatus = this.searchForm.get('projectStatus')!.value;
  //   this.auth.searchCustomerbyProject(projectStatus).subscribe((customers)=>{
  //     console.log("customer",customers)
  //     this.projects = customers;
  //     this.errorMessage = null;
  //   },
  //   error=>{
  //     this.projects = [];
  //     this.errorMessage = error.message;
  //   });
  // }
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

  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
  
}
