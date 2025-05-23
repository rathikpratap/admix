import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MessagingService } from '../service/messaging-service';

@Component({ 
  selector: 'app-script-dashboard',
  templateUrl: './script-dashboard.component.html',
  styleUrls: ['./script-dashboard.component.css']
})
export class ScriptDashboardComponent {

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
    this.auth.scriptProjects().subscribe((res:any)=>{
      this.data = res;
    });
    this.auth.urgentScriptProjects().subscribe((res:any)=>{
      this.urgent = res;
    });
    this.auth.highScriptProjects().subscribe((res:any)=>{
      this.high = res;
    });
    this.auth.mediumScriptProjects().subscribe((res:any)=>{
      this.medium = res;
    });
    this.auth.getTodayEntriesScript().subscribe((todayRes:any)=>{
      const totalDayEntry = todayRes.totalDayEntry;
      if(Array.isArray(totalDayEntry)){
        this.todayEntries = totalDayEntry.length;
      }else{
        this.todayEntries = 0;
      }
    },(error)=>{
      console.error('Error Fetching today Entries', error);
    });
    this.auth.getScriptData().subscribe((list : any)=>{
      this.data = list;
      this.dataLength = list.length;
    });
    this.auth.getCompleteScriptData().subscribe((list:any)=>{
      this.completed = list;
      this.completeLength = list.length;
    });
    this.auth.allscriptProjects().subscribe((res:any)=>{
      this.allProjects = res.length;
    });
  }
  openUpdatePanel(userId: string) {
    const url = `/script-home/script-update/${userId}`;
    window.location.href = url;
  }
}
