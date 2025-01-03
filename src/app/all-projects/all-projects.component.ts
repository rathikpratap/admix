import { Component, ViewChild, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent {

  @ViewChild('fileInput') fileInput: any;
  selectedFile: File | null = null;

  updateEditorVisible: boolean = true;
  data: any = [];
  searchForm: FormGroup;
  customers: any[] = [];
  errorMessage: any;
  dataLength: any;
  emp: any;
  editors: any;
  tok: any;
  selectedRowIndex: number = -1;
  scriptPassDate: any;
  previousMonthName: string;
  previousTwoMonthName: string;
  currentMonthName: string;
  Previousdata: any;
  TwoPreviousdata: any;
  isExpanded: boolean = false;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private renderer: Renderer2, private router: Router, private toastr: ToastrService) {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });

    this.auth.allProjects().subscribe((list: any) => {
      console.log("list", list)
      this.data = list;
    });
    this.auth.allPreviousProjects().subscribe((list: any) => {
      console.log("list", list)
      this.Previousdata = list;
    });
    this.auth.allTwoPreviousProjects().subscribe((list: any) => {
      console.log("list", list)
      this.TwoPreviousdata = list;
    });

    this.auth.allEmployee().subscribe((res: any) => {
      console.log("employee==>", res);
      this.emp = res;
    })
    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();
  }
  ToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
  }

  highlightRow(index: number) {
    this.selectedRowIndex = index;
  }  

  updateEditors(user: any) {
    const currentDate = new Date().toISOString().split('T')[0];
    let selectedEmployee:any;
    if (user.projectStatus === 'Scripting' || user.projectStatus === 'Script Correction') {
      // Update the scriptPassDate for the specific user
      user.scriptPassDate = currentDate;
      selectedEmployee = this.emp.find((employee:any)=> employee.signupUsername === user.scriptWriter);
    } else if (user.projectStatus === 'Voice Over') {
      user.voicePassDate = currentDate;
      selectedEmployee = this.emp.find((employee: any) => employee.signupUsername === user.voiceOverArtist);
    } else if (user.projectStatus === 'Video Editing' || user.projectStatus === 'Video Changes' || user.projectStatus === 'Video Done') {
      user.editorPassDate = currentDate;
      selectedEmployee = this.emp.find((employee: any) => employee.signupUsername === user.editor);
    } else if (user.projectStatus === 'Graphic Designing') {
      user.graphicPassDate = currentDate;
      selectedEmployee = this.emp.find((employee: any) => employee.signupUsername === user.graphicDesigner);
    }
    this.auth.updateEditors([user]).subscribe((res: any) => { 
      if (res) {
        //alert("Project Successfully Assigned");
        this.toastr.success(`Project Successfully Assigned to ${selectedEmployee.signupUsername}`,'Success');
        console.log("Editor Updated List", res);
      }
      console.log("Successfully Assigned", res);
    });
    let msgTitle='';
    let msgBody='';
    if(user.projectStatus === 'Scripting' || user.projectStatus === 'voice Over' || user.projectStatus === 'Video Editing' || user.projectStatus === 'Graphic Design'){
      msgTitle = 'Project Assigned';
      msgBody = `Project number ${user.custCode} assigned`;
    }else if(user.projectStatus === 'Script Correction' || user.projectStatus === 'Video Changes'){
      msgTitle = 'Project Correction Assigned';
      msgBody = `Project number ${user.custCode} Correction Assigned`;
    }

    this.auth.sendNotifications([selectedEmployee],[user], msgTitle, msgBody, currentDate).subscribe((res:any)=>{
      if(res){
        this.toastr.success('Notification Send','Success');
        //alert("Notification Send");
      }else{
        this.toastr.error('Error Sending Notification','Error')
        //alert("Error Sending Notification");
      }
    });
  }
  updatePriority(user:any,priority:any){
    this.auth.updateEditors([user]).subscribe((res:any)=>{
      if(res) {
        this.toastr.success(`Project ${user.custName} Priority Set to ${priority}`,'Success');
      }
    });
  } 
  openUpdatePanel(userId: string) {
    const url = `/update-panel/${userId}`;
    //window.open(url, '_blank');
    window.location.href = url;
  }

  searchCustomer() {
    const mobile = this.searchForm.get('mobile')!.value;
    console.log("NUMBER===>", mobile);
    this.auth.searchCustomerbyMobile(mobile).subscribe((customers: any) => {
      console.log("customer", customers)
      this.customers = customers;
      this.errorMessage = null;
    },
      error => {
        this.customers = [];
        this.errorMessage = error.message;
      });
  }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    //this.uploadFileToServer(file);
  }
  async selectFile(): Promise<void> {
    if (this.selectedFile) {
      try {
        await this.auth.uploadFile(this.selectedFile);
        alert("File Upload Successful");
        console.log("Upload Successful");
      } catch (error) {
        console.log("Error Uploading File", error);
      }
    } else {
      console.log("No File Selected")
    }

  }

  downloadFile() {
    this.auth.downloadFile();
  }

  onDate() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.getDatabyRange(startDate, endDate).subscribe((rangeData: any) => {
        console.log("Data by Date Range===>>", rangeData.rangeTotalData);
        this.rangeData = rangeData.rangeTotalData;
      })
    }
  }

  downloadRangeFile() {
    const startDateValue = this.dateRangeForm.value.startDate;
    const endDateValue = this.dateRangeForm.value.endDate;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      this.auth.downloadRangeFile(startDate, endDate);
    }
  }

  filterEmployeesByRole(projectStatus: string): any[] { 
    switch (projectStatus) {
      case 'Scripting':
        return this.emp.filter((employee: any) => employee.signupRole === 'Script Writer');
      case 'Video Editing':
      case 'Video Changes':
      case 'Video Done':
        return this.emp.filter((employee: any) => employee.signupRole === 'Editor');
      case 'Voice Over': 
        return this.emp.filter((employee: any) => employee.signupRole === 'VO Artist');
      case 'Graphic Designing':
        return this.emp.filter((employee: any) => employee.signupRole === 'Graphic Designer')
      default:
        return []; // Return an empty array if no specific role is selected
    }
  }
  invoice(userId: string) {
    const url = `/main-invoice/${userId}`;
    window.open(url, '_blank');
  }

}
