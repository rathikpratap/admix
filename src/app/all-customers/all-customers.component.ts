import { Component, ViewChild,Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css']
})
export class AllCustomersComponent {
 
 @ViewChild('fileInput') fileInput:any;
 selectedFile: File | null =null;
 
  tok:any; 
  data:any=[];
  searchForm: FormGroup;
  customers :any[] = [];  
  errorMessage: any;
  previousMonthName: string;
  previousTwoMonthName: string;
  currentMonthName: string;
  dataPreviousMonth: any=[];
  dataTwoPreviousMonth:any=[];
  isExpanded: boolean = false;
  GraphicEmp:any;
  sales:any;
  transferName: any;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder,private renderer: Renderer2,private toastr: ToastrService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      this.transferName = this.tok.signupUsername;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
 
    this.auth.salesAllProjects().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
    });
    this.auth.salesPreviousMonthProjects().subscribe((list : any)=>{
      console.log("list",list)
      this.dataPreviousMonth = list;
    });
    this.auth.salesPreviousTwoMonthProjects().subscribe((list : any)=>{
      console.log("list",list)
      this.dataTwoPreviousMonth = list;
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.GraphicEmp = res.filter((emp:any)=> emp.signupRole === 'Graphic Designer');
    });
    this.auth.getSalesTeam().subscribe((res:any)=>{
      console.log("SALESTEAM=======>>", res);
      this.sales = res;
    })


    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();
  }

  ToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
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

  downloadFile(){
    this.auth.downloadFile();
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.getDatabyRange(startDate, endDate).subscribe((rangeData:any)=>{
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }

  downloadRangeFile(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;

    if(startDate && endDate){
      this.auth.downloadRangeFile(startDate, endDate);
    }
  }

  delete(id:any, i:any){
    console.log(id);
    if(window.confirm("Are you Sure want to Delete?")){
      this.auth.deleteCust(id).subscribe((res : any)=>{
        this.data.splice(i,1);
      })
    }
  }
  openUpdatePanel(userId: string) {
    const url = `/salesHome/updateCustomer/${userId}`;
    //window.open(url, '_blank');
    window.location.href = url;
  }
  invoice(userId: string){
    const url = `/salesHome/main-invoice/${userId}`;
    window.open(url,'_blank');
  }

  updateDesigner(user:any,designer:any){
    user.graphicPassDate = new Date().toISOString();
    this.auth.updateEditors([user]).subscribe((res:any)=>{
      if(res){
        this.toastr.success(`Project ${user.custName} Assigned to ${designer}`,'Success');
      }else{
        this.toastr.error('Project Assigned Failed', 'Error');
      }
    });
  };
  updatePriority(user:any,priority:any){
    this.auth.updateEditors([user]).subscribe((res:any)=>{
      if(res) { 
        this.toastr.success(`Project ${user.custName} Priority Set to ${priority}`,'Success');
      }
    });
  };
  updateStatus(user:any,graphicStatus:any){
    this.auth.updateEditors([user]).subscribe((res:any)=>{
      if(res){
        this.toastr.success(`Project ${user.custName} Status changed to ${graphicStatus}`,'Success');
      }
    })
  }
  transferLead(user:any,newSalesTeam:any){
    const currentDate = new Date().toISOString();
    const transferData = {
      custId: user._id,
      salesTeam: newSalesTeam,
      closingDate: currentDate,
      name: this.transferName
    };
    this.auth.transferCustomertoSales(transferData).subscribe((res:any)=>{
      this.toastr.success("Transferred successfully","Success");
      console.log("Customer transferred successfully", res);
    })
  }
 
}
