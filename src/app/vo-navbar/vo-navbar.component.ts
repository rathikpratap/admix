import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-vo-navbar',
  templateUrl: './vo-navbar.component.html',
  styleUrls: ['./vo-navbar.component.css']
})
export class VoNavbarComponent {
 
  tok:any;

  @Output() voSideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private auth:AuthService){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })
  }

  voSideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.voSideNavToggled.emit(this.menuStatus);
  }
  logout(){
    this.auth.logout();
  }
}
