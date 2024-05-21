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
      console.log("Data===>", res);
    });
    this.auth.getTodayEntriesEditorOther().subscribe((todayRes:any)=>{
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
    this.auth.getEditorOtherData().subscribe((list : any)=>{ 
      console.log("list",list)
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
    const url = `/editor-home/editor-other`;
    window.open(url, '_blank');
  }
  openUpdatePanel(userId: string) {
    const url = `/editor-home/editor-update/${userId}`;
    window.open(url, '_blank');
  }
}
