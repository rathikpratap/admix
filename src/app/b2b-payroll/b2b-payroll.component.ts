import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-b2b-payroll',
  templateUrl: './b2b-payroll.component.html',
  styleUrls: ['./b2b-payroll.component.css']
})
export class B2bPayrollComponent {
  tok:any;
  dateRangeForm : FormGroup;
  payrollForm : FormGroup;
  employee:any;
  className:any;
  message:any;
  selectData:any;
  EmpRole:any;
  completeProjects: any;
  inCompleteProjects: any;
  

  constructor(private auth:AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    this.dateRangeForm = new FormGroup({
      B2bEditor: new FormControl<string | null>('null'),
      startDate: new FormControl<string | null>(null),
        endDate: new FormControl<string | null>(null)
    });
    this.payrollForm = new FormGroup({
      payrollTm: new FormControl<string>(''),
      payrollRole: new FormControl<string>(''),
      totalProjects: new FormControl(0),
      completeProjects: new FormControl(0),
      inCompleteProjects: new FormControl(0),
      EditorPaybalPayment: new FormControl(0),
      EditorPaymentStatus: new FormControl("null"),
      EditorCNR: new FormControl(""),
      editorPaymentDate: new FormControl(""),
      companyName: new FormControl("")
    })

    this.auth.allEmployee().subscribe((res: any) => {
      this.employee = res.filter((emp: any) => emp.signupRole === 'Editor')
      console.log("Editorss===>", this.employee);
    });
  }

  onDate(){
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;
    const tmName = this.dateRangeForm.value.B2bEditor;

    if(startDate && endDate && tmName){
      this.auth.getTmPayB2b(startDate, endDate, tmName).subscribe((res:any)=>{
        this.selectData = res;
        console.log(res);
        this.payrollForm.get('payrollTm')?.setValue(tmName);
        console.log("Editor===>", res[0].editor);
        this.auth.allEmployee().subscribe((resEmp:any)=>{
          console.log("RESEMp===>", resEmp);
          resEmp.forEach((employee: any) => {
            if (employee.signupUsername === tmName) {
              this.payrollForm.get('payrollRole')?.setValue(employee.signupRole);
              this.EmpRole = employee.signupRole;
              console.log("ROLE===>", this.EmpRole);
            }
          });
          if(this.EmpRole === 'Editor'){
            this.auth.getEditorDetailsB2b(startDate,endDate,tmName).subscribe((res1:any)=>{
              this.completeProjects = res1.completeProjects.length;
              this.payrollForm.get('completeProjects')?.setValue(this.completeProjects);
              this.inCompleteProjects = res1.inCompleteProjects.length;
              this.payrollForm.get('inCompleteProjects')?.setValue(this.inCompleteProjects);
              this.payrollForm.get('EditorPaybalPayment')?.setValue(res1.paybalAmount);
              console.log("Paybal Amount===>", res1.paybalAmount);
            })
            console.log("Hello Editor");
          }
        });
        console.log("TOtal Projects===>", res.length);
        this.payrollForm.get('totalProjects')?.setValue(res.length);
        
      })
    }
  }

  onSubmit(){
    
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue? new Date(startDateValue) : null;
    const endDate = endDateValue? new Date(endDateValue) : null;
    const tmName = this.dateRangeForm.value.B2bEditor;
    this.payrollForm.get('companyName')?.setValue('B2b');

    if(startDate && endDate && tmName){
      console.log("TMMMMNAMEEE===>>",tmName);
      this.auth.updatePayrollDetailsB2b(startDate,endDate,tmName, this.payrollForm.value).subscribe((res:any)=>{

        console.log("Payroll Information Update", this.payrollForm.value);
        alert(res.message);
      },(err)=>{
        console.log(err)
      })
    }
  }
  
}
 