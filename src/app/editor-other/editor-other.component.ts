import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-editor-other',
  templateUrl: './editor-other.component.html',
  styleUrls: ['./editor-other.component.css']
})
export class EditorOtherComponent {
  data: any; 
  tok:any;
  todayEntries : any;
  dataLength : any;
  completed:any;
  completeLength:any;
  allProjects:any;

  constructor(private auth: AuthService,private renderer: Renderer2){
    this.auth.getProfile().subscribe((res:any)=>{ 
      this.tok = res?.data;
      if(!this.tok){
        alert("Session Expired, PLease Login Again");
        this.auth.logout();
      }
    })
    this.auth.editorOtherProjects().subscribe((res:any)=>{
      this.data = res;
    });
    this.auth.getTodayEntriesEditorOther().subscribe((todayRes:any)=>{
      const totalDayEntry = todayRes.totalDayEntry;
      if(Array.isArray(totalDayEntry)){
        this.todayEntries = totalDayEntry.length;
      }else{
        this.todayEntries = 0;
      }
      
    },(error)=>{
      console.error('Error Fetching today Entreis', error);
    });
    this.auth.getEditorOtherData().subscribe((list : any)=>{
      this.data = list;
      this.dataLength = list.length;
    });
    this.auth.getCompleteEditorOtherData().subscribe((list:any)=>{
      this.completed = list;
      this.completeLength = list.length;
    });
    this.auth.allEditorOtherProjects().subscribe((res:any)=>{
      this.allProjects = res.length;
    })
  }
  otherProjects(){
    const url = `/editor-home/editor-dashboard`;
    window.location.href = url;
  }
  openUpdatePanel(userId: string) {
    const url = `/editor-home/editor-b2b-update/${userId}`;
    window.location.href = url;
  }
}
