import { Component } from '@angular/core';
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
export class GraphicDashboardComponent {
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

  constructor(private auth: AuthService,private messagingService: MessagingService,private toastr: ToastrService){
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
    this.auth.urgentGraphicProjects().subscribe((res:any)=>{
      this.urgent = res;
    });
    this.auth.pendingGraphicProjects().subscribe((res:any)=>{
      this.pending = res;
    });
    this.auth.todayGraphicProjects().subscribe((res:any)=>{
      this.today = res;
    });
    this.auth.changesGraphicProjects().subscribe((res:any)=>{
      this.changes = res;
    })
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
}
