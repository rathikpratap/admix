import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectCountService } from '../service/project-count.service';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrl: './project-status.component.css'
})
export class ProjectStatusComponent {

  tok: any;
  data: any = [];
  searchForm: FormGroup;
  customers: any[] = [];
  errorMessage: any;
  models: any;
  senderName: any;
  role: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService, private countService: ProjectCountService) {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      } else {
        this.senderName = this.tok.signupUsername;
        this.role = this.tok.signupRole;
        console.log("FRONT ROLE:", this.tok?.signupRole);
        console.log("FRONT USER:", this.tok?.signupUsername);
        this.loadModelProject();
      }
    });
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });
    this.auth.getModels().subscribe((res: any) => {
      this.models = res;
      console.log("Model Name:", this.models);
    })
  }

  searchCustomer() {
    const mobile = this.searchForm.get('mobile')!.value;
    this.auth.searchCustomerbyMobile(mobile).subscribe((customers) => {
      this.customers = customers;
      this.errorMessage = null;
    },
      error => {
        this.customers = [];
        this.errorMessage = error.message;
      });
  }
  updateModel(user: any) {
    this.auth.updateModelName(user).subscribe((res: any) => {
      if (res) {
        this.toastr.success('Model Assigned', 'Success');
      } else {
        this.toastr.error('Model Assigned Failed');
      }
    })
  }
  subUpdateModel(user: any, sub: any) {
    this.auth.updateSubEntry(user._id, sub).subscribe((res: any) => {
      if (res) {
        this.toastr.success('Model Assigned', 'Success');
      } else {
        this.toastr.error('Model Assigned Failed', 'Error');
      }
    });
  }
  getStatusOptionsForUser(user: any) {
    const sendStatus = user?.status?.find((s: any) =>
      s.code.startsWith('SEND_BY_')
    );
    const employeeName = sendStatus ? this.getEmployeeFromCode(sendStatus.code) : this.senderName;

    return [
      {
        label: `Send by ${employeeName} to Shiva Sir`,
        value: `SEND_BY_${employeeName}`
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
        label: `Received to ${employeeName} from Shiva Sir`,
        value: `RECEIVED_TO_${employeeName}`
      }
    ];
  }
  onStatusChange(user: any, code: string, event: any) {
    if (!user.status) {
      user.status = [];
    }
    if (event.target.checked) {
      const alreadyExists = user.status.find((s: any) => s.code === code);
      if (!alreadyExists) {
        user.status.push({
          code: code,
          date: new Date()
        });
      }
    } else {
      user.status = user.status.filter((s: any) => s.code !== code);
    }
    this.auth.updateModelStatus(user._id, user.status).subscribe(() => {
      this.toastr.success('Status Updated');
      this.updateCountToService();
    });
  }
  onSubStatusChange(user: any, sub: any, code: string, event: any) {
    if (!sub.status) {
      sub.status = [];
    }
    if (event.target.checked) {
      sub.status.push({ code, date: new Date() });
    } else {
      sub.status = sub.status.filter((s: any) => s.code !== code);
    }
    this.auth.updateModelSubStatus(user._id, sub.custCode, sub.status).subscribe(() => {
      this.toastr.success('Status Updated');
      this.updateCountToService();
    });
  }
  hasStatus(user: any, code: string): boolean {
    return user?.status?.some((s: any) => s.code === code);
  }
  hasSubStatus(sub: any, code: string): boolean {
    return sub?.status?.some((s: any) => s.code === code);
  }
  isStatusDisabled(code: string): boolean {
    if (code === 'SEND_BY_SHIVA_SIR' || code === 'RECEIVED_TO_SHIVA_SIR') {
      return this.tok?.signupUsername !== 'Shiva Varshney'
    }
    return false;
  }
  getStatusDate(user: any, code: string): Date | null {
    const status = user?.status?.find((s: any) => s.code === code);
    return status ? status.date : null;
  }
  getSubStatusDate(sub: any, code: string): Date | null {
    const status = sub?.status?.find((s: any) => s.code === code);
    return status ? status.date : null;
  }
  loadModelProject() {
    this.auth.onlyModelProjectsAdmin(this.senderName, this.role).subscribe((list: any) => {
      console.log("FRONT ROLE:", this.tok?.signupRole);
      console.log("FRONT USER:", this.tok?.signupUsername);

      this.data = list.map((entry: any) => ({
        ...entry,
        showSub: false
      }));
      this.updateCountToService();
    });
  }
  getEmployeeFromCode(code: string): string {
    if (!code) return '';
    if (code.startsWith('SEND_BY_')) {
      return code.replace('SEND_BY_', '');
    }
    if (code.startsWith('RECEIVED_TO_')) {
      return code.replace('RECEIVED_TO_', '');
    }
    return '';
  }
  // getEmployeeFromStatus(statusArray: any[]): string {

  //   const send = statusArray?.find((s: any) =>
  //     s.code?.startsWith('SEND_BY_')
  //   );

  //   return send
  //     ? this.getEmployeeFromCode(send.code)
  //     : this.senderName;
  // }
  // isCountable(entity: any): boolean {
  //   const status = entity?.status || [];
  //   const emp = this.getEmployeeFromStatus(status);

  //   const A = status.some((s: any) =>
  //     s.code === `SEND_BY_${emp}`);

  //   const B = status.some((s: any) =>
  //     s.code === 'SEND_BY_SHIVA_SIR');

  //   const C = status.some((s: any) =>
  //     s.code === 'RECEIVED_TO_SHIVA_SIR');

  //   const D = status.some((s: any) =>
  //     s.code === `RECEIVED_TO_${emp}`);

  //   return A && (C || !B) && !D;
  // }

  // getTotalCount() {
  //   let count = 0;
  //   this.data.forEach((user: any) => {
  //     if (this.isCountable(user)) {
  //       count++;
  //     }
  //     user.subEntries?.forEach((sub: any) => {
  //       if (this.isCountable(sub)) {
  //         count++;
  //       }
  //     });
  //   });
  //   console.log('COUNT=========>>', count);
  //   return count;
  // }
  // updateCountToService() {
  //   // const total = this.getTotalCount();
  //   // this.countService.setCount(total);
  //   const total = this.countService.calculateTotal( this.data);
  //   this.countService.setCount(total);
  // }
  updateCountToService() {

    const isAdmin =
      Array.isArray(this.role)
        ? this.role.includes('Admin')
        : this.role === 'Admin';

    const total =
      this.countService.calculateTotal(
        this.data,
        this.senderName,
        isAdmin
      );

    this.countService.setCount(total);
  }


}
