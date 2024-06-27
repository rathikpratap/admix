import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../service/messaging-service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  message: any;
  

  constructor(private messagingService: MessagingService) {
    
  }

  ngOnInit() {
    //this.messagingService.requestPermission();
    this.messagingService.currentMessage.subscribe((message) => {
      if (message) {
        console.log("Message Arrived: ", message);
        this.message = message;
      } else {
        console.log("No message received");
      }
    });
  }
}
