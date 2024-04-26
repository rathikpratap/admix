import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-editor-navbar',
  templateUrl: './editor-navbar.component.html',
  styleUrls: ['./editor-navbar.component.css']
})
export class EditorNavbarComponent {
 
  tok:any;

  @Output() editorSideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private auth:AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })
  }

  editorSideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.editorSideNavToggled.emit(this.menuStatus);
  }
  logout(){
    this.auth.logout();
  }
}
