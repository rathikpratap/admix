import { Component, OnInit } from '@angular/core';
import { SocketService } from './service/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'admix-software';

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.log('Service Worker registration failed:', err);
        });
    }

    const username = localStorage.getItem('name');
    if(username){
      this.socketService.registerUser(username);
    }

    // 🔔 Socket.IO Listener
    this.socketService.onReminder().subscribe(reminder => {
      const shouldSnooze = confirm(`🔔 Call ${reminder.name} at ${reminder.number}.\n\nSnooze for 15 minutes?`);
    
      if (shouldSnooze) {
        this.socketService.snoozeReminder(reminder);
      }
    });
  }
}