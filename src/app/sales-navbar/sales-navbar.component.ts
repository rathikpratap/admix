import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-sales-navbar',
  templateUrl: './sales-navbar.component.html',
  styleUrls: ['./sales-navbar.component.css']
})
export class SalesNavbarComponent {
 
  tok:any;
  unreadNotif: any; 
  readNotif:any;
  unreadCount: number = 0;

  @Output() salesSideNavToggled = new EventEmitter<boolean>();
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

  SalesSideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.salesSideNavToggled.emit(this.menuStatus);
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
