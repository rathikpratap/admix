import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-editor-dashboard',
  templateUrl: './editor-dashboard.component.html',
  styleUrls: ['./editor-dashboard.component.css']
})
export class EditorDashboardComponent {
  data: any;

  constructor(private auth: AuthService){
    this.auth.editorProjects().subscribe((res:any)=>{
      this.data = res;
      console.log("Data===>", res);
    })
  }
}
