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
 
  data:any=[];
  searchForm: FormGroup;
  customers :any[] = [];
  errorMessage: any;
  dataLength: any; 

  dateRangeForm = new FormGroup({
    startDate : new FormControl(""),
    endDate: new FormControl("")
  });
  rangeData: any;
 
  constructor(private auth: AuthService, private formBuilder: FormBuilder){
    this.searchForm = this.formBuilder.group({
      mobile: ['']
    });

    this.auth.allProjects().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
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

}
