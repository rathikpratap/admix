import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../service/messaging-service';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  message:any;

  constructor(private messagingService: MessagingService){}

  ngOnInit() {
    this.messagingService.requestPermission()
      
  }
}
