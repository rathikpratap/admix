// import { Component, OnInit } from '@angular/core';
// import { SocketService } from './service/socket.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   title = 'admix-software';

//   constructor(private socketService: SocketService) { }

//   ngOnInit() {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.register('/firebase-messaging-sw.js')
//         .then((registration) => {
//           console.log('Service Worker registered with scope:', registration.scope);
//         })
//         .catch((err) => {
//           console.log('Service Worker registration failed:', err);
//         });
//     }

//     const username = localStorage.getItem('name');
//     if(username){
//       this.socketService.registerUser(username);
//     }

//     // 🔔 Socket.IO Listener
//     this.socketService.onReminder().subscribe(reminder => {
//       const shouldSnooze = confirm(`🔔 Call ${reminder.name} at ${reminder.number}.\n\nSnooze for 15 minutes?`);
    
//       if (shouldSnooze) {
//         this.socketService.snoozeReminder(reminder);
//       }
//     });
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService, CallReminder } from './service/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'admix-software';

  reminder: CallReminder | null = null;

  showReminder = false;

  private reminderSubscription?: Subscription;

  constructor(
    private socketService: SocketService
  ) {}

  ngOnInit(): void {

    /*
     * Firebase Service Worker
     * Ye future mein browser push notification ke liye useful hai.
     */
    if ('serviceWorker' in navigator) {

      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {

          console.log(
            '✅ Service Worker registered:',
            registration.scope
          );

        })
        .catch((err) => {

          console.error(
            '❌ Service Worker registration failed:',
            err
          );

        });
    }

    /*
     * Login user ko Socket.IO room mein register karo
     */
    const username = localStorage.getItem('name');

    console.log('👤 Logged-in user:', username);

    if (username) {

      this.socketService.registerUser(username);

    } else {

      console.warn(
        '⚠️ localStorage mein "name" nahi mila'
      );
    }

    /*
     * Reminder listener
     */
    this.reminderSubscription =
      this.socketService
        .onReminder()
        .subscribe((reminder: CallReminder) => {

          console.log(
            '🔔 Showing reminder on screen:',
            reminder
          );

          this.reminder = reminder;

          this.showReminder = true;

          // Optional browser notification sound
          this.playReminderSound();
        });
  }

  /*
   * Call Now
   */
  callCustomer(): void {

    if (!this.reminder) {
      return;
    }

    const number = this.reminder.number;

    window.location.href = `tel:${number}`;
  }

  /*
   * Snooze 15 minutes
   */
  snoozeReminder(): void {

    if (!this.reminder) {
      return;
    }

    console.log(
      '😴 Snoozing:',
      this.reminder
    );

    this.socketService.snoozeReminder(
      this.reminder
    );

    this.closeReminder();
  }

  /*
   * Close reminder without snooze
   */
  closeReminder(): void {

    this.showReminder = false;

    this.reminder = null;
  }

  /*
   * Simple notification sound
   */
  private playReminderSound(): void {

    try {

      const audio = new Audio(
        'assets/sounds/reminder.mp3'
      );

      audio.play().catch(error => {

        console.log(
          'Notification sound blocked by browser:',
          error
        );

      });

    } catch (error) {

      console.log(
        'Unable to play reminder sound',
        error
      );
    }
  }

  ngOnDestroy(): void {

    this.reminderSubscription?.unsubscribe();

  }
}