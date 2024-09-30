import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MessagingService } from '../service/messaging-service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-graphic-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './graphic-dashboard.component.html',
  styleUrl: './graphic-dashboard.component.css'
})
export class GraphicDashboardComponent implements OnInit {
  data: any; 
  tok:any;
  todayEntries : any;
  dataLength : any;
  completed:any;
  completeLength:any;
  allProjects:any;
  accessToken:any;
  urgent:any;
  pending:any;
  today:any;
  changes:any;
  isExpanded: boolean = false;
  todayLength:any;
  pendingLength:any;
  urgentLength:any;
  changesLength:any;
  watermark: any;
  todayAssigned:any;
  todayAssignedLength:any;
  pendingAssigned:any;
  pendingAssignedLength:any;

  ngOnInit(): void {
    this.auth.todayGraphicProjects().subscribe((res:any)=>{
      this.today = res;
      this.todayLength = res.length;

      this.today.forEach((project:any)=>{
        this.startTimer(project);
        if(project.remainingAmount >= 0){
          project.watermark = 'YES';
        }else{
          project.watermark = 'NO';
        }
      });
    });
    this.auth.urgentGraphicProjects().subscribe((res:any)=>{
      this.urgent = res;
      this.urgentLength = res.length;

      this.urgent.forEach((project:any)=>{
        this.startTimer(project);
        if(project.remainingAmount >= 0){
          project.watermark = 'YES';
        }else{
          project.watermark = 'NO';
        }
      });
    });
    this.auth.pendingGraphicProjects().subscribe((res:any)=>{
      this.pending = res;
      this.pendingLength = res.length;

      this.pending.forEach((project:any)=>{
        this.startTimer(project);
        if(project.remainingAmount >= 0){
          project.watermark = 'YES';
        }else{
          project.watermark = 'NO';
        }
      });
    });
    this.auth.changesGraphicProjects().subscribe((res:any)=>{
      this.changes = res;
      this.changesLength = res.length;

      this.changes.forEach((project:any)=>{
        this.startTimer(project);
        if(project.remainingAmount >= 0){
          project.watermark = 'YES';
        }else{
          project.watermark = 'NO';
        }
      });
    });
    this.auth.todayAssignedTask().subscribe((res:any)=>{
      this.todayAssigned = res;
      this.todayAssignedLength = res.length;

      this.todayAssigned.forEach((project:any)=>{
        this.taskStartTimer(project);
      })
    });
    this.auth.pendingAssignedTask().subscribe((res:any)=>{
      this.pendingAssigned = res;
      this.pendingAssignedLength = res.length;

      this.pendingAssigned.forEach((project:any)=>{
        this.taskStartTimer(project);
      })
    });
  }

  constructor(private auth: AuthService,private messagingService: MessagingService,private toastr: ToastrService, private renderer: Renderer2){
    this.auth.getAccessToken().subscribe((res:any)=>{
      this.accessToken = res;
    });

    this.messagingService.requestPermission();

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
      console.log("TOK======>>", this.tok.signupName); 
      if(!this.tok){
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    // this.auth.scriptProjects().subscribe((res:any)=>{
    //   this.data = res;
    //   console.log("Data===>", res);
    // });
    this.auth.getTodayEntriesGraphics().subscribe((todayRes:any)=>{
      console.log('Response Data:', todayRes);
      const totalDayEntry = todayRes.totalDayEntry;
      if(Array.isArray(totalDayEntry)){
        this.todayEntries = totalDayEntry.length;
      }else{
        this.todayEntries = 0;
      }
    },(error)=>{
      console.error('Error Fetching today Entries', error);
    });
    this.auth.getGraphicData().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
      this.dataLength = list.length;
    });
    this.auth.getCompleteGraphicData().subscribe((list:any)=>{
      this.completed = list;
      this.completeLength = list.length;
    });
    this.auth.allGraphicProjects().subscribe((res:any)=>{
      this.allProjects = res.length;
    });
  }
  openUpdatePanel(userId: string) {
    const url = `/script-home/script-update/${userId}`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
  updateStatus(user:any,priority:any){
    const name = this.tok.signupName;
    const currentDate = new Date().toISOString();
    user.graphicDeliveryDate = currentDate;
    const msgTitle = 'Status Changed';
    const msgBody = `Project ${user.custBussiness} status changed`;
    this.auth.updateEditors([user]).subscribe((res:any)=>{
      if(res){
        this.toastr.success(`Project status Succefully changed to ${priority}`,'Success');
      }
    });
    this.auth.sendNotifications([name],[user],msgTitle,msgBody, currentDate).subscribe((res:any)=>{
      if(res){
        this.toastr.success('Notification Send','Success');
      }else{
        this.toastr.error('Error Sending Notification','Error');
      }
    })
  }
  ToggleExpanded(){
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
  }

  startTimer(project: any): void {
    const graphicDate = new Date(project.graphicPassDate);
    const deliveryDate = new Date(project.graphicDeliveryDate);
    
    const endTime = new Date(graphicDate.getTime() + 24*60*60*1000);

    project.remainingTime = this.calculateRemainingTime(endTime);
    project.shouldBlink = false;
    project.timeUp = false;
    project.within24Hours = false;

    setInterval(()=>{
      project.remainingTime = this.calculateRemainingTime(endTime);
      //project.shouldBlink = this.isBlinking(endTime);
      //console.log("WITHIN24======>>",deliveryDate.getTime() )
      if (Math.abs(deliveryDate.getTime() - graphicDate.getTime()) <= 24 * 60 * 60 * 1000) {
        project.within24Hours = true;   // Stop blinking if within 24 hours
        project.shouldBlink = false;
      } else if (project.remainingTime === "Time is up!") {
        project.timeUp = true;   // Set flag for "Time is up!"
        project.shouldBlink = false; // Stop blinking when time is up
      } else {
        project.shouldBlink = this.isBlinking(endTime); // Continue blinking logic
      }

      
    },1000);
  }

  calculateRemainingTime(endTime: Date): string {
    const now = new Date();
    const remainingTime = endTime.getTime() - now.getTime();

    if (remainingTime <= 0) {
      return 'Time is up!';
    }

    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  isBlinking(endTime: Date): boolean {
    const now = new Date();
    let blinkingTime = endTime.getTime() - now.getTime();
    if(Math.floor((blinkingTime / (1000 * 60 * 60)) % 24) <= 3){
      return true;
    }
    return false;
    //return blinkingTime <= 4 * 60 * 60 * 1000;
  }

  taskStartTimer(project: any):void {
    const taskDate = new Date(project.assignedDate);
    const taskDeliveryDate = new Date(project.taskDeliveryDate);
    const taskEndTime = new Date(taskDate.getTime() + 24*60*60*1000);
    
    project.taskRemainingTime = this.calculateRemainingTime(taskEndTime);

    project.taskShouldBlink = false;
    project.taskTimeUp = false;
    project.taskWithin24Hours = false;

    setInterval(()=>{
      project.taskRemainingTime = this.taskCalculateRemainingTime(taskEndTime);

      if(Math.abs(taskDeliveryDate.getTime() - taskDate.getTime()) <= 24*60*60*1000){
        project.taskWithin24Hours = true;
        project.taskShouldBlink = false;
      }else if( project.taskRemainingTime === "Time is up!"){
        project.taskTimeUp = true;
        project.taskShouldBlink = false;
      } else {
        project.taskShouldBlink = this.taskIsBlinking(taskEndTime);
      }
    },1000);
  }

  taskCalculateRemainingTime(taskEndTime: Date): string {
    const now = new Date();
    const remainingTime = taskEndTime.getTime() - now.getTime();

    if (remainingTime <= 0) {
      return 'Time is up!';
    }

    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
  taskIsBlinking(endTime: Date): boolean {
    const now = new Date();
    let blinkingTime = endTime.getTime() - now.getTime();
    if(Math.floor((blinkingTime / (1000 * 60 * 60)) % 24) <= 3){
      return true;
    }
    return false;
    //return blinkingTime <= 4 * 60 * 60 * 1000;
  }
}
