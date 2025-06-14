import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessagingService } from '../service/messaging-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-b2b-dashboard',
  templateUrl: './b2b-dashboard.component.html',
  styleUrls: ['./b2b-dashboard.component.css']
}) 
export class B2bDashboardComponent {
  tok:any;
  totalEntries: any;
  data:any;
  dataLength:any;
  allTotalEntries:any;
  completeProjects:any;
  allActive:any;
  allComplete:any;
  allTotalAmount:any;
  MonthlyAmount:any;
  completeData:any;
  accessToken:any;
  emp:any;

  constructor(private auth: AuthService,private messagingService: MessagingService, private toastr: ToastrService){
    this.auth.getAccessToken().subscribe((res:any)=>{
      this.accessToken = res;
    });

    this.messagingService.requestPermission();
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.getMonthEntriesB2b().subscribe((res:any)=>{
      this.totalEntries = res.totalEntries.length;
      this.MonthlyAmount = res.totalAmount;
    },(error)=>{
      console.error('Error Fetching Entries',error);
    });
    this.auth.getCustDataB2b().subscribe((list : any)=>{
      this.data = list;
      this.dataLength = list.length;  
    });
    this.auth.getCompleteProjectsB2b().subscribe((res:any)=>{
      this.completeProjects = res.length;
      this.completeData = res;
    });
    this.auth.getAllEntriesB2b().subscribe((res:any)=>{
      this.allTotalEntries = res.totalEntries.length;
      this.allTotalAmount = res.totalAmount;
    });
    this.auth.getAllCustDataB2b().subscribe((res:any)=>{
      this.allActive = res.length;
    });
    this.auth.getAllCompleteProjectsB2b().subscribe((res:any)=>{
      this.allComplete = res.length;
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.emp = res;
    });
  }
  filterEmployeeByRole(){
    return this.emp.filter((employee: any) =>
    employee.signupRole && employee.signupRole.includes('Editor'));
  }
  updateb2b(user: any){
    const currentDate = new Date().toISOString().split('T')[0];
    user.b2bEditorPassDate = currentDate;
    let selectedEmployee = this.emp.find((employee: any) => employee.signupUsername === user.b2bEditor);
  
    this.auth.updateB2bEditorname([user]).subscribe((res: any) => {
      if(res){
        this.toastr.success(`Project Successfully Assigned to ${selectedEmployee.signupUsername}`,'Success');
      }
      console.log("SUCCESSFULL", res);
    })
  }
  admix(){
    const url = `/admin-dashboard`;
    window.location.href = url;
  }
}
