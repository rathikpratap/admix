import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-submission',
  templateUrl: './project-submission.component.html',
  styleUrl: './project-submission.component.css'
})
export class ProjectSubmissionComponent {

  tok: any;
  data: any=[];
  searchForm: FormGroup;
  customers: any[] = [];
  errorMessage: any;
  models: any;
  senderName: any;
  // statusOptions = [
  //   { label: 'Send by Rathik', value: 'SEND_RATHIK'},
  //   { label: 'Send by Shiva Sir', value: 'SEND_SHIVA'},
  //   { label: 'Received to Shiva Sir', value: 'RECEIVED_SHIVA'},
  //   { label: 'Received to Rathik', value: 'RECEIVED_RATHIK'}
  // ];

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }else{
        this.senderName = this.tok.signupUsername;
      }
    });
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
    this.auth.onlyModelProjects().subscribe((list : any)=>{
      this.data = list.map((entry: any)=>({
        ...entry,
        showSub: false
      }));
    });
    this.auth.getModels().subscribe((res:any)=>{
      this.models = res;
      console.log("Model Name:", this.models);
    })
  }

  searchCustomer(){
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobile(mobile).subscribe((customers)=>{
      this.customers = customers;
      this.errorMessage = null;
    },
    error=>{
      this.customers = [];
      this.errorMessage = error.message;
    });
  }
  updateModel(user:any){
    this.auth.updateModelName(user).subscribe((res:any)=>{
      if(res){
        this.toastr.success('Model Assigned','Success');
      }else{
        this.toastr.error('Model Assigned Failed');
      }
    })
  }
  subUpdateModel(user:any, sub:any){
    this.auth.updateSubEntry(user._id,sub).subscribe((res: any)=>{
      if(res){
        this.toastr.success('Model Assigned','Success');
      }else{
        this.toastr.error('Model Assigned Failed', 'Error');
      }
    });
  }
  getStatusOptions(){
    return [
      {
        label: `Send by ${this.senderName} to Shiva Sir`,
        value: `SEND_BY_${this.senderName.toUpperCase()}`
      },
      {
        label: 'Send by Shiva Sir to Model',
        value: 'SEND_BY_SHIVA_SIR'
      },
      {
        label: 'Received to Shiva Sir from Model',
        value: 'RECEIVED_TO_SHIVA_SIR'
      },
      {
        label: `Received to ${this.senderName} from Shiva Sir`,
        value: `RECEIVED_TO_${this.senderName.toUpperCase()}`
      }
    ];
  }
  onStatusChange(user:any, code: string, event: any){
    if(!user.status){
      user.status = [];
    }
    if(event.target.checked){
      const alreadyExists = user.status.find((s:any)=> s.code === code);
      if(!alreadyExists){
        user.status.push({
          code: code,
          date: new Date()
        });
      }
    }else{
      user.status = user.status.filter((s: any) => s.code !== code);
    }
    this.auth.updateModelStatus(user._id, user.status).subscribe(()=>{
      this.toastr.success('Status Updated');
    });
  }
  onSubStatusChange(user:any, sub:any, code: string, event: any){
    if(!sub.status){
      sub.status = [];
    }
    if(event.target.checked){
      sub.status.push({code, date: new Date()});
    }else{
      sub.status = sub.status.filter((s: any) => s.code !== code);
    }
    this.auth.updateModelSubStatus(user._id, sub._id, sub.status).subscribe(() => {
      this.toastr.success('Status Updated');
    });
  }
  hasStatus(user:any, code: string): boolean{
    return user?.status?.some((s:any) => s.code === code);
  }
  hasSubStatus(sub:any, code:string): boolean{
    return sub?.status?.some((s:any) => s.code === code);
  }
  isStatusDisabled(code: string): boolean{
    if(code === 'SEND_BY_SHIVA_SIR' || code === 'RECEIVED_TO_SHIVA_SIR'){
      return this.tok?.signupUsername !== 'Shiva Varshney'
    }
    return false;
  }
}
