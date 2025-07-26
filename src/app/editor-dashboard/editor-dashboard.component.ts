import { Component, Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MessagingService } from '../service/messaging-service';

@Component({
  selector: 'app-editor-dashboard',
  templateUrl: './editor-dashboard.component.html',
  styleUrls: ['./editor-dashboard.component.css']
})
export class EditorDashboardComponent implements OnInit {
  data: any;
  tok: any;
  editorName: any;
  todayEntries: any;
  dataLength: any;
  completed: any;
  completeLength: any;
  allProjects: any;
  accessToken: any;
  unreadNotif: any;
  readNotif: any;
  unreadCount: number = 0;
  urgent: any;
  medium: any;
  high: any;
  changes: any;
  isExpanded: boolean = false;
  urgentLength: any;
  highLength: any;
  mediumLength: any;
  changesLength: any;
  currentMonthPoints: number = 0;
  editorList: any[] = [];

  ngOnInit(): void {
    this.auth.getProfile().subscribe((res: any) => {
      this.tok = res?.data;
      console.log("TOK=========>>", this.tok.signupName);
      this.editorName = this.tok.signupUsername;
      if (!this.tok) {
        alert("Session Expired, Please Login Again");
        this.auth.logout();
      }
      console.log("EDITOR NAME=>>", this.editorName);
      this.auth.updateEditorMonthlyPoints(this.editorName).subscribe((res: any) => {
        console.log("TOTAL POINTS=====>>", res);
      });
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      this.currentMonthPoints = this.tok.monthlyEditorPoints?.[currentMonth] || 0;
      this.auth.getAllEditorMonthlyPoints().subscribe((res: any) => {
        this.editorList = res.editors.slice(0,3);
        console.log("Editor Points List:", this.editorList);
      });
    });
  }

  constructor(private auth: AuthService, private messagingService: MessagingService, private renderer: Renderer2) {

    this.auth.getAccessToken().subscribe((res: any) => {
      this.accessToken = res;
    });
    this.messagingService.requestPermission();


    this.auth.urgentEditorProjects().subscribe((res: any) => {
      this.urgent = res;
      this.urgentLength = res.length;
    });
    this.auth.highEditorProjects().subscribe((res: any) => {
      this.high = res;
      this.highLength = res.length;
    });
    this.auth.mediumEditorProjects().subscribe((res: any) => {
      this.medium = res;
      this.mediumLength = res.length;
    });
    this.auth.changesEditorProjects().subscribe((res: any) => {
      this.changes = res;
      this.changesLength = res.length;
    });

    this.auth.getTodayEntriesEditor().subscribe((todayRes: any) => {
      const totalDayEntry = todayRes.totalDayEntry;
      if (Array.isArray(totalDayEntry)) {
        this.todayEntries = totalDayEntry.length;
      } else {
        this.todayEntries = 0;
      }
    }, (error) => {
      console.error('Error Fetching today Entreis', error);
    });
    this.auth.getEditorData().subscribe((list: any) => {
      this.data = [...list.products, ...list.b2bProducts];
      this.dataLength = this.data.length;
    });
    this.auth.getCompleteEditorData().subscribe((list: any) => {
      // this.completed = list;
      // this.completeLength = this.completed.length;
      this.completed = [...list.products, ...list.b2bProducts];
      this.completeLength = this.completed.length;
    });
    this.auth.allEditorProjects().subscribe((res: any) => {
      this.allProjects = res.list.length;
    });
    this.auth.getNotif().subscribe((res: any) => {
      this.unreadNotif = res.unReadNotif;
      this.readNotif = res.readNotif;
      this.unreadCount = res.unReadNotif.length;
    });
  }
  otherProjects() {
    const url = `/editor-home/editor-other`;
    window.location.href = url;
  }
  bundles() {
    const url = `/editor-home/bundle-dashboard`;
    window.open(url, '_blank');
  }
  openUpdatePanel(userId: string, type: string) {
    if (type === 'Customer') {
      const url = `/editor-home/editor-update/${userId}`;
      window.location.href = url;
    } else if (type === 'b2b') {
      const url = `/editor-home/editor-b2b-update/${userId}`;
      window.location.href = url;
    }

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
    })
  }
  ToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.renderer.setAttribute(document.querySelector('.btn'), 'aria-expanded', this.isExpanded.toString());
  }
}