import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-b2b-projects',
  templateUrl: './new-b2b-projects.component.html',
  styleUrl: './new-b2b-projects.component.css'
})
export class NewB2bProjectsComponent {

  message:string = '';
  isProcess:boolean = false;
  className = 'd-none'
  tok!:any;
  dataLength!:any;
  employee: any;
  allEmployee:any;
  Graphicemp:any;
  companies: any;

  codeInput2!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    console.log("Its Called");
    const inputElement = this.el.nativeElement.querySelector('input[type=text]');
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
  }
  b2bCustomerForm = new FormGroup({
    b2bProjectCode: new FormControl("", [Validators.required]),
    companyName: new FormControl("", [Validators.required]),
    b2bProjectName: new FormControl("",[Validators.required]),
    b2bCategory: new FormControl("null",[Validators.required]),
    b2bVideoType: new FormControl("null", [Validators.required]),
    b2bProjectDate: new FormControl(""),
    b2bBillType: new FormControl("null", [Validators.required]),
    b2bProjectPrice: new FormControl(),
    b2bVideoDurationMinutes: new FormControl(""),
    b2bVideoDurationSeconds: new FormControl(""),
    b2bEditor: new FormControl(""),
    youtubeLink: new FormControl(""),
    b2bRemark: new FormControl(""),
    salesPerson: new FormControl(""),
    salesTeam: new FormControl(""),
    projectStatus: new FormControl("null"),
    b2bRestAmount: new FormControl(),
    b2bRemainingAmount: new FormControl(),
    b2bAdvanceAmount: new FormControl()
  });

  constructor(private auth:AuthService, private router:Router, private renderer: Renderer2, private el: ElementRef, private toastr: ToastrService){
    
    this.b2bCustomerForm.get('b2bRestAmount')!.setValue(0);

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });

    this.b2bCustomerForm.valueChanges.subscribe(values =>{
      const projectAmount = parseFloat(values.b2bProjectPrice || 0);
      const advanceAmount = parseFloat(values.b2bAdvanceAmount || 0);
      const remainingAmount = projectAmount - advanceAmount;
      this.b2bCustomerForm.get('b2bRemainingAmount')!.setValue(remainingAmount);
    });

    this.auth.allEmployee().subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.employee = res.filter((empS: any) => empS.signupRole && empS.signupRole.includes('Editor'));
      } else {
        console.error("Unexpected response format:", res);
      }
    });
    this.auth.b2bDataLength().subscribe((list : any)=>{
      this.dataLength = list + 1; 
      if(this.dataLength){
        this.b2bCustomerForm.get('b2bProjectCode')!.setValue(this.dataLength);
      }
    });
    this.auth.getCompany().subscribe((res:any)=>{
        this.companies = res.filter((company: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.companyName === company.companyName)
        );
    });
  }

  getB2bCustomerFormControl(b2bName: any) : AbstractControl | null{
    return this.b2bCustomerForm.get(b2bName);
  }
  addb2bCust(){
    const currentDate = new Date().toISOString();
    this.isProcess = true;
    console.warn(this.b2bCustomerForm.value);
    const custData = this.b2bCustomerForm.value;
    this.auth.addB2b(custData).subscribe(res =>{ 
      if(res.success){
        this.isProcess = false;
        this.message = "Customer Added";
        this.className = 'alert alert-success';
        this.b2bCustomerForm.reset();
        this.b2bCustomerForm.get('b2bProjectCode')!.setValue(this.dataLength + 1);
        let selectedEmployee = this.allEmployee.find((emp:any)=> emp.signupRole === 'Admin');
        let msgTitle = "New B2b Closing";
        let msgBody = `${custData.b2bProjectName} by ${this.tok.signupUsername}`;
        this.auth.sendNotification([selectedEmployee], msgTitle,msgBody, currentDate).subscribe((res:any)=>{
          if(res){
            this.toastr.success("Notification Send","Success");
          }else{
            this.toastr.error("Error Sending Notification","Error");
          }
        })
      }else{
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