import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-points-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './points-table.component.html',
  styleUrl: './points-table.component.css'
})
export class PointsTableComponent {

  pointsForm : FormGroup;
  tok: any;
  // emp: any;
  className = 'd-none';
  message: string = '';
  isProcess: boolean = false;
  data: any;
  
  constructor(private auth: AuthService, private fb: FormBuilder, private toastr: ToastrService){
    this.pointsForm = this.fb.group({
      // employeeName : new FormControl(""),
      points: this.fb.array([])
    });

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    // this.auth.allEmployee().subscribe((res:any)=>{
    //   this.emp = res;
    // });
    this.addPoints();
  }
  get points(): FormArray {
    return this.pointsForm.get('points') as FormArray;
  }
  addPoints(){
    const pointsGroup = this.fb.group({
      second: [0],
      points: [0]
    });
    this.points.push(pointsGroup);
  }
  removePoint(index: number){
    if(this.points.length > 1){
      this.points.removeAt(index);
    }
  }
  createMinuteField(previousMinute: number =0): FormGroup{
    return this.fb.group({
      amount: new FormControl(previousMinute)
    });
  }
  addMinuteField(){
    const lastMinute = this.points.at(this.points.length - 1).value.amount;
    this.points.push(this.createMinuteField(lastMinute));
  }
  submitPoints(){
    this.isProcess = true;
    const pointData = this.pointsForm.value;
    this.auth.addPoint(pointData).subscribe((res:any)=>{
      if(res.success){
        this.isProcess = false;
        this.message = "Points Added";
        this.className = 'alert alert-success';
        this.pointsForm.reset();
      }else{
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
      }
    },err=>{
      this.isProcess = false;
        this.message = "Server Error";
        this.className = 'alert alert-success';
    })
  }

}
