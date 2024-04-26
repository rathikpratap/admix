import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-script-navbar',
  templateUrl: './script-navbar.component.html',
  styleUrls: ['./script-navbar.component.css']
})
export class ScriptNavbarComponent {

  tok:any;

  @Output() scriptSideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private auth:AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })
  }

  scriptSideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.scriptSideNavToggled.emit(this.menuStatus);
  }
  logout(){
    this.auth.logout();
  }
}
