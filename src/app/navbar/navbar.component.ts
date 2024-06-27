import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 
  tok:any;
  notifCount:any;
  unreadNotif: any;
  readNotif:any;

  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private auth: AuthService){

    this.auth.getNotif().subscribe((res:any)=>{
      console.log("Notifications===>", res);
      this.unreadNotif = res.unReadNotif;
      this.readNotif = res.readNotif;
      this.notifCount = res.unReadNotif.length;
    })

    this.auth.getProfile().subscribe((res:any)=>{
      console.log("Token===>", res)
      this.tok = res?.data
    })
  }
  SideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }
  logout(){
    this.auth.logout();
  }
}
