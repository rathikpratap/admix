import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MessagingService } from '../service/messaging-service';

@Component({
  selector: 'app-editor-dashboard',
  templateUrl: './editor-dashboard.component.html',
  styleUrls: ['./editor-dashboard.component.css']
})
export class EditorDashboardComponent {
  data: any; 
  tok:any;
  todayEntries : any;
  dataLength : any;
  completed:any; 
  completeLength:any;
  allProjects:any;
  accessToken:any;
  unreadNotif: any;
  readNotif:any;
  unreadCount: number = 0;
  urgent:any;
  medium:any;
  high:any;

  constructor(private auth: AuthService,private renderer: Renderer2,private messagingService: MessagingService){
    
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
    this.auth.urgentEditorProjects().subscribe((res:any)=>{
      this.urgent = res;
    });
    this.auth.highEditorProjects().subscribe((res:any)=>{
      this.high = res;
    });
    this.auth.mediumEditorProjects().subscribe((res:any)=>{
      this.medium = res;
    });
    this.auth.getTodayEntriesEditor().subscribe((todayRes:any)=>{
      const totalDayEntry = todayRes.totalDayEntry;
      if(Array.isArray(totalDayEntry)){
        this.todayEntries = totalDayEntry.length;
      }else{
        this.todayEntries = 0;
      }
    },(error)=>{
      console.error('Error Fetching today Entreis', error);
    });
    this.auth.getEditorData().subscribe((list : any)=>{ 
      this.data = list;
      this.dataLength = list.length;
    });
    this.auth.getCompleteEditorData().subscribe((list:any)=>{
      this.completed = list;
      this.completeLength = list.length;
    });
    this.auth.allEditorProjects().subscribe((res:any)=>{
      this.allProjects = res.length;
    });
    this.auth.getNotif().subscribe((res:any)=>{
      this.unreadNotif = res.unReadNotif;
      this.readNotif = res.readNotif;
      this.unreadCount = res.unReadNotif.length;
    });
  }
  otherProjects(){
    const url = `/editor-home/editor-other`;
    window.location.href = url;
  }
  bundles(){
    const url = `/editor-home/bundle-dashboard`;
    window.open(url,'_blank');
  }
  openUpdatePanel(userId: string) {
    const url = `/editor-home/editor-update/${userId}`;
    window.location.href = url;
  }
  markAsRead(notifId:any){
    this.auth.markRead({id: notifId}).subscribe((res:any)=>{
      console.log("Notification Read");
      const notif = this.unreadNotif.find((notif:any) => notif._id === notifId);
      if (notif) {
        this.readNotif.push(notif);
        this.unreadNotif = this.unreadNotif.filter((notif:any) => notif._id !== notifId);
        this.unreadCount = this.unreadNotif.length;
      }
    })
  }
}