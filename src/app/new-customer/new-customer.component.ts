import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-customer', 
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  integerRegex = '^((\\+91-?)|0)?[0-9]{10}$';
  message:string = '';
  isProcess:boolean = false;
  className = 'd-none'
  tok!:any;
  dataLength!:any;
  b2bdataLength!:any;
  countries: any;
  states: any; 
  cities: any;
  Category: any;
  companies: any;
  employee: any;
  allEmployee:any;
  Graphicemp:any;

  codeInput!: ElementRef<HTMLInputElement>;
  codeInput2!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.onCountryChange();
  }
  
  ngAfterViewInit() {
    console.log("Its Called");
    const inputElement = this.el.nativeElement.querySelector('input[type=text]');
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
  } 
 
  constructor(private auth:AuthService, private router:Router, private renderer: Renderer2, private el: ElementRef, private toastr: ToastrService){

    this.customerForm.get('restAmount')!.setValue('0');

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data; 
      this.b2bCustomerForm.get('salesPerson')!.setValue(this.tok.signupUsername);
      this.b2bCustomerForm.get('salesTeam')!.setValue(this.tok.salesTeam);
      if(this.tok) {
        this.customerForm.get('salesPerson')!.setValue(this.tok.signupUsername);
        this.customerForm.get('salesTeam')!.setValue(this.tok.salesTeam);
        if(this.tok.salesTeam !== 'Shiva Development'){
          this.customerForm.get('companyName')!.setValue('AdmixMedia');
        }
      }else{
        alert("Session Expired, Please Login Again")
        this.router.navigate(['/login']);
      }
    });

    this.auth.dataLength().subscribe((list : any)=>{
      this.dataLength = list + 1; 
      if(this.dataLength){
        this.customerForm.get('custCode')!.setValue(this.dataLength);
      }
    }); 

    this.auth.b2bDataLength().subscribe((list : any)=>{
      this.b2bdataLength = list + 1; 
      if(this.dataLength){
        this.b2bCustomerForm.get('b2bProjectCode')!.setValue(this.b2bdataLength);
      }
    })

    this.customerForm.valueChanges.subscribe(values =>{
      const closingPriceValue = parseFloat(values.closingPrice|| '0');
      const AdvPayValue = parseFloat(values.AdvPay|| '0');

      const remainingAmount = closingPriceValue - AdvPayValue;
      
      this.customerForm.get('remainingAmount')!.setValue(remainingAmount.toString());

    });

    this.auth.getCountries().subscribe((Countrydata: any) =>{
      this.countries = Countrydata;
    });

    this.auth.getCategory().subscribe((category:any)=>{
      this.Category = category;
    })
    this.auth.getCompany().subscribe((res:any)=>{
      if(this.tok.salesTeam === 'Shiva Development') {
        this.companies = res.filter((company: any, index: number, self: any[]) =>
          index === self.findIndex((c: any) => c.companyName === company.companyName)
        );
      } else{
        this.customerForm.get('companyName')?.setValue('AdmixMedia');
      }
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.allEmployee = res;
      this.employee = res.filter((emp:any)=> emp.signupRole === 'Editor');
      this.Graphicemp = res.filter((Gemp:any)=> Gemp.signupRole === 'Graphic Designer');
    });
  }

  customerForm = new FormGroup({
    custCode : new FormControl("", [Validators.required]),
    custName : new FormControl("", [Validators.required]),
    custNumb : new FormControl("", [Validators.required, Validators.pattern(this.integerRegex)]),
    custNumb2 : new FormControl(""),
    custBussiness : new FormControl("", [Validators.required]),
    closingDate : new FormControl("", [Validators.required]),
    closingPrice : new FormControl("", [Validators.required]),
    closingCateg : new FormControl("null", [Validators.required]),
    billType: new FormControl("null", [Validators.required]),
    AdvPay : new FormControl("", [Validators.required]),
    remainingAmount : new FormControl("",[Validators.required]),
    restAmount : new FormControl(""), 
    customerType : new FormControl("",[Validators.required]),
    custCountry : new FormControl("IN"),
    custCity : new FormControl("null"),
    custState : new FormControl("",[Validators.required]),
    projectStatus : new FormControl("null",[Validators.required]),
    salesPerson : new FormControl("",[Validators.required]),
    youtubeLink : new FormControl(""),
    remark  : new FormControl(""),
    salesTeam : new FormControl(""),
    companyName : new FormControl(""),
    graphicDesigner : new FormControl(""),
    graphicPassDate : new FormControl(""),
    Qr : new FormControl("",[Validators.required])
  });

  b2bCustomerForm = new FormGroup({
    b2bProjectCode: new FormControl("", [Validators.required]),
    companyName: new FormControl("", [Validators.required]),
    b2bProjectName: new FormControl("",[Validators.required]),
    b2bCategory: new FormControl("null",[Validators.required]),
    b2bVideoType: new FormControl("null", [Validators.required]),
    b2bProjectDate: new FormControl(""),
    b2bBillType: new FormControl("null", [Validators.required]),
    b2bProjectPrice: new FormControl(""),
    b2bVideoDurationMinutes: new FormControl(""),
    b2bVideoDurationSeconds: new FormControl(""),
    b2bEditor: new FormControl(""),
    youtubeLink: new FormControl(""),
    b2bRemark: new FormControl(""),
    salesPerson: new FormControl(""),
    salesTeam: new FormControl(""),
    projectStatus: new FormControl("")
  });
 
  getControls(name: any) : AbstractControl | null{
    return this.customerForm.get(name)
  }
  getB2bCustomerFormControl(b2bName: any) : AbstractControl | null{
    return this.b2bCustomerForm.get(b2bName);
  }
  

  onCountryChange(): void{
    const countryCode = this.customerForm.get('custCountry')?.value;
    this.auth.getStates(countryCode).subscribe((Statedata : any)=>{
      this.states = Statedata;
    }); 
  }

  onStateChange(): void{
    const stateCode = this.customerForm.get('custState')?.value;
    const countryCode = this.customerForm.get('custCountry')?.value;
    this.auth.getCities(countryCode, stateCode).subscribe((Citydata : any)=>{
      this.cities = Citydata;
    });
  }

  addCust(){
    const currentDate = new Date().toISOString();
    this.customerForm.get('graphicPassDate')!.setValue(currentDate);
    this.isProcess = true;
    console.warn(this.customerForm.value);
    const custData = this.customerForm.value;
    this.auth.addcustomer(custData).subscribe(res =>{
      if(res.success){
        this.isProcess = false;
        this.message = res.message; 
        this.className = 'alert alert-success';
        this.customerForm.reset();
        this.customerForm.get('custCode')!.setValue(this.dataLength + 1);
        let selectedEmployee = this.allEmployee.find((emp:any)=> emp.signupRole === 'Admin');
        let msgTitle = "New Closing";
        let msgBody = `${custData.custBussiness} by ${this.tok.signupUsername}`;
        this.auth.sendNotification([selectedEmployee], msgTitle,msgBody, currentDate).subscribe((res:any)=>{
          if(res){
            this.toastr.success("Notification Send","Success");
            //alert("Notification Send");
          }else{
            this.toastr.error("Error Sending Notification","Error");
            //alert("Error Sending Notification");
          }
        });
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
        this.b2bCustomerForm.get('b2bProjectCode')!.setValue(this.b2bdataLength + 1);
        this.router.navigate([this.router.url])
        .then(() => {
          window.location.reload();
        });
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
