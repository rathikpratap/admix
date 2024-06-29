import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 
  tok:any;
  unreadNotif: any;
  readNotif:any;
  unreadCount: number = 0;

  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private auth: AuthService){

    this.auth.getNotif().subscribe((res:any)=>{
      //console.log("Notifications===>", res);
      this.unreadNotif = res.unReadAdmin;
      this.readNotif = res.readAdmin;
      this.unreadCount = res.unReadAdmin.length;
    })

    this.auth.getProfile().subscribe((res:any)=>{
      //console.log("Token===>", res)
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
  markAsRead(notifId:any){
    this.auth.markRead({id: notifId}).subscribe((res:any)=>{
      //console.log("Notification Read");
      const notif = this.unreadNotif.find((notif:any) => notif._id === notifId);
      if (notif) {
        this.readNotif.push(notif);
        this.unreadNotif = this.unreadNotif.filter((notif:any) => notif._id !== notifId);
        this.unreadCount = this.unreadNotif.length;
      }
    })
  }
}
