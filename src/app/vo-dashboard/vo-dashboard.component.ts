import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MessagingService } from '../service/messaging-service';

@Component({
  selector: 'app-vo-dashboard',
  templateUrl: './vo-dashboard.component.html',
  styleUrls: ['./vo-dashboard.component.css']
})
export class VoDashboardComponent {
  data: any; 
  tok:any;
  todayEntries : any;
  dataLength : any;
  completed:any;
  completeLength:any;
  allProjects:any;
  accessToken:any;
  urgent:any;
  high:any;
  medium:any;

  constructor(private auth: AuthService,private messagingService: MessagingService){

    this.auth.getAccessToken().subscribe((res:any)=>{
      this.accessToken = res;
    });
    this.messagingService.requestPermission();

    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data; 
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.voProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    });
    this.auth.urgentVoProjects().subscribe((res:any)=>{
      this.urgent = res;
    });
    this.auth.highVoProjects().subscribe((res:any)=>{
      this.high = res;
    });
    this.auth.mediumVoProjects().subscribe((res:any)=>{
      this.medium = res;
    });
    this.auth.getTodayEntriesVo().subscribe((todayRes:any)=>{
      console.log('Response Data:', todayRes);
      const totalDayEntry = todayRes.totalDayEntry;
      if(Array.isArray(totalDayEntry)){
        this.todayEntries = totalDayEntry.length;
      }else{
        this.todayEntries = 0;
      }
      
    },(error)=>{
      console.error('Error Fetching today Entreis', error);
    });
    this.auth.getVoData().subscribe((list : any)=>{ 
      console.log("list",list)
      this.data = list;
      this.dataLength = list.length;
    });
    this.auth.getCompleteVoData().subscribe((list:any)=>{
      this.completed = list;
      this.completeLength = list.length;
    });
    this.auth.allVoProjects().subscribe((res:any)=>{
      this.allProjects = res.length;
    })
  }
  openUpdatePanel(userId: string) {
    const url = `/vo-home/vo-update/${userId}`;
    window.location.href = url;
    //window.open(url, '_blank');
  }
}
