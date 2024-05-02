import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent {

  @ViewChild('fileInput') fileInput:any;
 selectedFile: File | null =null;
 
 updateEditorVisible: boolean = true;
  data:any=[];
  searchForm: FormGroup;
  customers :any[] = [];
  errorMessage: any;
  dataLength: any; 
  emp: any;
  editors: any; 
  tok:any;
  selectedRowIndex: number = -1;

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;
 
  constructor(private auth: AuthService, private formBuilder: FormBuilder){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });

    this.auth.allProjects().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
    });

    this.auth.allEmployee().subscribe((res : any)=>{
      console.log("employee==>", res);
      this.emp = res;
    })
  }

  highlightRow(index: number) {
    this.selectedRowIndex = index;
  }

  updateEditors(){
    this.auth.updateEditors(this.data).subscribe((res: any)=>{
      if(this.data){
        alert("Project Successfully Assigned ");
        console.log("Editor Updated List", this.data);
      }
      console.log("Successfully Assigned", res);
    })
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

  uploadFile(event:any){
    this.selectedFile = event.target.files[0];
    //this.uploadFileToServer(file);
  }
  async selectFile(): Promise<void>{
    if(this.selectedFile){ 
      try{
        await this.auth.uploadFile(this.selectedFile);
        alert("File Upload Successful");
        console.log("Upload Successful");
      } catch(error){
        console.log("Error Uploading File", error);
      }
    } else{
      console.log("No File Selected")
    }
    
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

  filterEmployeesByRole(projectStatus: string): any[] {
    switch (projectStatus) {
        case 'Scripting': 
            return this.emp.filter((employee:any) => employee.signupRole === 'Script Writer');
        case 'Video Editing':
        case 'Video Changes':
        case 'Video Done':
            return this.emp.filter((employee:any) => employee.signupRole === 'Editor');
        case 'Voice Over':
            return this.emp.filter((employee:any) => employee.signupRole === 'VO Artist');
        default:
            return []; // Return an empty array if no specific role is selected
    }
  }
  
}
