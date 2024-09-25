import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graphic-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphic-navbar.component.html',
  styleUrl: './graphic-navbar.component.css'
})
export class GraphicNavbarComponent {
 
  tok:any;
  unreadNotif: any;
  readNotif:any;
  unreadCount: number = 0;
  
  @Output() graphicSideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private auth:AuthService){
    this.auth.getNotif().subscribe((res:any)=>{
      console.log("Notifications===>", res);
      this.unreadNotif = res.unReadNotif;
      this.readNotif = res.readNotif;
      this.unreadCount = res.unReadNotif.length;
    })
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })
  }

  graphicSideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.graphicSideNavToggled.emit(this.menuStatus);
  }
  logout(){
    this.auth.logout();
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
