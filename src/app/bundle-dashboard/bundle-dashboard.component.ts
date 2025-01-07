import { Component, Renderer2 } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MessagingService } from '../service/messaging-service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bundle-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bundle-dashboard.component.html',
  styleUrl: './bundle-dashboard.component.css'
})
export class BundleDashboardComponent {
  data: any;
  tok: any;
  todayEntries: any;
  dataLength: any;
  completed: any;
  completeLength: any;
  allProjects: any;
  accessToken: any;
  unreadNotif: any;
  readNotif: any;
  unreadCount: number = 0;

  constructor(private auth: AuthService, private messagingService: MessagingService, private toastr: ToastrService) {
    this.auth.getAccessToken().subscribe((res: any) => {
      this.accessToken = res;
    });
    this.messagingService.requestPermission();

    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
    });
    // this.auth.editorProjects().subscribe((res: any) => {
    //   this.data = res;
    // });
    this.auth.getTodayEntriesEditor().subscribe((todayRes: any) => {
      console.log('Response Data:', todayRes);
      const totalDayEntry = todayRes.totalDayEntry;
      if (Array.isArray(totalDayEntry)) {
        this.todayEntries = totalDayEntry.length;
      } else {
        this.todayEntries = 0;
      }
    }, (error) => {
      console.error('Error Fetching today Entries', error);
    });
    this.auth.getBundleData().subscribe((list: any) => {
      this.data = list;
      this.dataLength = list.length;
      console.log("ACTIVE====>>", this.data);
    });
    this.auth.getCompleteBundleData().subscribe((list: any) => {
      this.completed = list;
      this.completeLength = list.length;
      console.log("NOTACTIVE===>>", this.completed);
    });
    this.auth.allBundleProjects().subscribe((res: any) => {
      this.allProjects = res.length;
    });
    this.auth.getNotif().subscribe((res: any) => {
      console.log("Notifications======>>", res);
      this.unreadNotif = res.unReadNotif;
      this.readNotif = res.readNotif;
      this.unreadCount = res.unReadNotif.length;
    });
  }
  projects() {
    const url = `/editor-home/editor-dashboard`;
    window.open(url, '_blank');
  }
  markAsRead(notifId: any) {
    this.auth.markRead({ id: notifId }).subscribe((res: any) => {
      console.log("Notification Read");
      const notif = this.unreadNotif.find((notif: any) => notif._id === notifId);
      if (notif) {
        this.readNotif.push(notif);
        this.unreadNotif = this.unreadNotif.filter((notif: any) => notif._id !== notifId);
        this.unreadCount = this.unreadNotif.length;
      }
    });
  }
  updateEditors(user: any) {
    this.auth.updateEditors([user]).subscribe((res: any) => {
      if (res) {
        this.toastr.success('Bundle Created', 'Success');
      } else {
        this.toastr.error('Bundle Creation Failed', 'Error');
      }
    });
  }
}
