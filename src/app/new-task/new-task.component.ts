import { Component,ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {

  message: string ='';
  isProcess:boolean = false;
  className = 'd-none';
  tok : any;
  dataLength:any;
  srInput!: ElementRef<HTMLInputElement>;
  Graphicemp:any;
 
  constructor(private auth:AuthService){

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.tasksDataLength().subscribe((list:any)=>{
      this.dataLength = list + 1;
      if(this.dataLength){
        this.taskForm.get('SrNo')!.setValue(this.dataLength);
      }
    });
    this.auth.allEmployee().subscribe((res:any)=>{
      this.Graphicemp = res.filter((emp:any)=> emp.signupRole && emp.signupRole.includes('Graphic Designer') || emp.signupRole.includes('Editor'));
      console.log("GRAPHIC======>>", this.Graphicemp);
    });
  }

  taskForm = new FormGroup({
    SrNo : new FormControl(),
    taskName : new FormControl(""),
    taskDescription : new FormControl(""),
    assignedDate : new FormControl(""),
    graphicDesigner: new FormControl(""),
    graphicStatus: new FormControl(""),
    assignedBy: new FormControl("")
  });

  addTask(){
    const currentDate = new Date().toISOString();
    this.taskForm.get('assignedDate')!.setValue(currentDate);
    this.taskForm.get('graphicStatus')!.setValue('Not Completed');
    this.taskForm.get('assignedBy')!.setValue(this.tok.signupUsername);
    this.isProcess = true;
    const taskData = this.taskForm.value;
    this.auth.addTask(taskData).subscribe((res:any)=>{
      if(res.success){
        this.isProcess = false;
        this.message = "Task Added";
        this.className = 'alert alert-success';
        this.taskForm.reset();
        this.taskForm.get('SrNo')!.setValue(this.dataLength + 1);
      }else{
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
      }
    },err=>{
      this.isProcess = false;
      this.message = 'Server Error';
      this.className = 'alert alert-danger';
    })
  }
}