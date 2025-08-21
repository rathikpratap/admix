import { Component, ViewChild, Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent implements OnInit {

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
  allClosings: any;
  closingData: any;
  cloData: any;
  cloDataPrev: any;
  cloTwoDataPrev: any;
  pointsUpdate: any;

  dateRangeForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl("")
  });
  closingForm = new FormGroup({
    closing_name: new FormControl("null")
  });
  rangeData: any;

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });

    this.searchForm.get('mobile')!.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const searchValue = value?.trim();
          if (searchValue === '') {
            // Option 1: Clear the list if input is empty
            this.customers = [];
            return []; // return empty observable
          }
          return this.auth.searchCustomerbyMobile(searchValue);
        })
      )
      .subscribe({
        next: (customers: any[]) => {
          this.customers = customers;
          this.errorMessage = null;

          if (customers.length === 0) {
            this.toastr.warning('No customer found', 'Search Result');
          }
        },
        error: (error) => {
          this.customers = [];
          this.errorMessage = error.message;
          this.toastr.error('Error while searching', 'Search Error');
        }
      });

    this.closingForm.get('closing_name')?.valueChanges.subscribe(value => {
      this.closingData = this.closingForm.get('closing_name')?.value;
      this.getData();
    })
  }
  getData() {
    this.auth.closingDataCurrentMonth(this.closingData).subscribe((list: any) => {
      this.cloData = list;
    });
    this.auth.closingDataPrevMonth(this.closingData).subscribe((list: any) => {
      this.cloDataPrev = list;
    });
    this.auth.closingDataTwoPrevMonth(this.closingData).subscribe((list: any) => {
      this.cloTwoDataPrev = list;
    })
  }
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
      this.data = list.map((entry: any) => ({
        ...entry,
        showSub: false
      }));
    });
    this.auth.allPreviousProjects().subscribe((list: any) => {
      this.Previousdata = list.map((entry: any) => ({
        ...entry,
        showSub: false
      }));
    });
    this.auth.allTwoPreviousProjects().subscribe((list: any) => {
      this.TwoPreviousdata = list.map((entry: any) => ({
        ...entry,
        showSub: false
      }));
    });

    this.auth.allEmployee().subscribe((res: any) => {
      this.emp = res;
    });
    this.auth.allClosing().subscribe((res: any) => {
      this.allClosings = res;
    });
    this.previousMonthName = this.auth.getPreviousMonthName();
    this.previousTwoMonthName = this.auth.getPreviousTwoMonthName();
    this.currentMonthName = this.auth.getCurrentMonthName();

    this.auth.getPointsUpdate().subscribe((res: any) => {
      this.pointsUpdate = res.list;
      console.log("PAGAL ");
    });
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
    let selectedEmployee: any;
    if (user.projectStatus === 'Scripting' || user.projectStatus === 'Script Correction') {
      // Update the scriptPassDate for the specific user
      user.scriptPassDate = currentDate;
      selectedEmployee = this.emp.find((employee: any) => employee.signupUsername === user.scriptWriter);
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
        this.toastr.success(`Project Successfully Assigned to ${selectedEmployee.signupUsername}`, 'Success');
      }
      console.log("Successfully Assigned", res);
    });
    let msgTitle = '';
    let msgBody = '';
    if (user.projectStatus === 'Scripting' || user.projectStatus === 'voice Over' || user.projectStatus === 'Video Editing' || user.projectStatus === 'Graphic Design') {
      msgTitle = 'Project Assigned';
      msgBody = `Project number ${user.custCode} assigned`;
    } else if (user.projectStatus === 'Script Correction' || user.projectStatus === 'Video Changes') {
      msgTitle = 'Project Correction Assigned';
      msgBody = `Project number ${user.custCode} Correction Assigned`;
    }

    this.auth.sendNotifications([selectedEmployee], [user], msgTitle, msgBody, currentDate).subscribe((res: any) => {
      if (res) {
        this.toastr.success('Notification Send', 'Success');
      } else {
        this.toastr.error('Error Sending Notification', 'Error')
      }
    });
  }
  updatePriority(user: any, priority: any) {
    this.auth.updateEditors([user]).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Project ${user.custName} Priority Set to ${priority}`, 'Success');
      }
    });
  }
  openUpdatePanel(userId: string) {
    const url = `/update-panel/${userId}`;
    window.location.href = url;
  }

  updateSubEntryStatus(user: any, sub: any): void {
    const currentDate = new Date().toISOString().split('T')[0];
    let selectedEmployee: any;

    if (sub.projectStatus === 'Scripting' || sub.projectStatus === 'Script Correction') {
      sub.scriptPassDate = currentDate;
      selectedEmployee = this.emp.find((e: any) => e.signupUsername === sub.scriptWriter);
    } else if (sub.projectStatus === 'Voice Over') {
      sub.voicePassDate = currentDate;
      selectedEmployee = this.emp.find((e: any) => e.signupUsername === sub.voiceOver);
    } else if (sub.projectStatus === 'Video Editing' || sub.projectStatus === 'Video Changes' || sub.projectStatus === 'Video Done') {
      sub.editorPassDate = currentDate;
      selectedEmployee = this.emp.find((e: any) => e.signupUsername === sub.editor);
    } else if (sub.projectStatus === 'Graphic Designing') {
      sub.graphicPassDate = currentDate;
      selectedEmployee = this.emp.find((e: any) => e.signupUsername === sub.graphicDesigner);
    }

    this.auth.updateSubEntry(user._id, sub).subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Sub-entry assigned to ${selectedEmployee?.signupUsername || 'user'}`, 'Success');
      } else {
        this.toastr.error('Error updating sub-entry', 'Error');
      }
    });

    let msgTitle = '';
    let msgBody = '';
    if (['Scripting', 'Voice Over', 'Video Editing', 'Graphic Designing'].includes(sub.projectStatus)) {
      msgTitle = 'Project Assigned';
      msgBody = `Project number ${sub.custCode} assigned`;
    } else if (['Script Correction', 'Video Changes'].includes(sub.projectStatus)) {
      msgTitle = 'Project Correction Assigned';
      msgBody = `Project number ${sub.custCode} Correction Assigned`;
    }

    this.auth.sendNotifications([selectedEmployee], [sub], msgTitle, msgBody, currentDate).subscribe();
  }


  // searchCustomer() {
  //   const mobile = this.searchForm.get('mobile')!.value;
  //   this.auth.searchCustomerbyMobile(mobile).subscribe((customers: any) => {
  //     this.customers = customers;
  //     this.errorMessage = null;
  //   },
  //     error => {
  //       this.customers = [];
  //       this.errorMessage = error.message;
  //     });
  // }

  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
  }
  async selectFile(): Promise<void> {
    if (this.selectedFile) {
      try {
        await this.auth.uploadFile(this.selectedFile);
        alert("File Upload Successful");
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
        return this.emp.filter((employee: any) =>
          employee.signupRole && employee.signupRole.includes('Script Writer')
        );
      case 'Video Editing':
      case 'Video Changes':
      case 'Video Done':
        return this.emp.filter((employee: any) =>
          employee.signupRole && employee.signupRole.includes('Editor')
        );
      case 'Voice Over':
        return this.emp.filter((employee: any) =>
          employee.signupRole && employee.signupRole.includes('VO Artist')
        );
      case 'Graphic Designing':
        return this.emp.filter((employee: any) =>
          employee.signupRole && employee.signupRole.includes('Graphic Designer')
        );
      default:
        return []; // Return an empty array if no specific role is selected
    }
  }

  invoice(userId: string) {
    const url = `/main-invoice/${userId}`;
    window.open(url, '_blank');
  }

  updatePoints(point: any) {
    console.log("POIN POINT");
    this.auth.updatePoint(point).subscribe((res: any) => {
      if (point) {
        this.toastr.success("Point Updated", "Seccess");
      }
    },
      (err) => {
        this.toastr.error("Failed to update points", "Error");
        console.log("POINT Error====>>", err);
      })
  }
}