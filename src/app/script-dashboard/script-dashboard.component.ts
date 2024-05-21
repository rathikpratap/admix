import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

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

  constructor(private auth: AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data; 
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    });
    this.auth.scriptProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    });
    this.auth.getTodayEntriesScript().subscribe((todayRes:any)=>{
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
    this.auth.getScriptData().subscribe((list : any)=>{
      console.log("list",list)
      this.data = list;
      this.dataLength = list.length;
    });
    this.auth.getCompleteScriptData().subscribe((list:any)=>{
      this.completed = list;
      this.completeLength = list.length;
    });
    this.auth.allscriptProjects().subscribe((res:any)=>{
      this.allProjects = res.length;
    })
  }
  openUpdatePanel(userId: string) {
    const url = `/script-home/script-update/${userId}`;
    window.open(url, '_blank');
  }
}
