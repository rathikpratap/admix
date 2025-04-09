import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class MessagingService {
  private messageSource = new BehaviorSubject<any>(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private auth: AuthService) {
    const messaging = getMessaging();
    this.listen(messaging);
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BNz3hwrt0ONYRSXKw7IkU1XKO39OnWnu0eIqy0oG_P_TtcXozlo2BgfceLAwvt2yQhfF4ruMeANY4mq93ryzwRk' })
      .then((currentToken) => {
        if (currentToken) {
          console.log("Yes, We have Token");
          console.log(currentToken);
          this.saveToken(currentToken);
        } else {
          console.log("We have a problem ");
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
  }

  saveToken(token1: string) {
    this.auth.saveToken(token1).subscribe(
      (res: any) => {
        if (res.success) {
          console.log("User Token Saved==>", res);
        } else {
          console.warn("Failed to save token", res.message);
        }
      },
      (error: any) => {
        console.error("Error saving token", error);
      }
    );
  }

  listen(messaging: Messaging) {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.playNotificationSound();
      this.messageSource.next(payload);
    });
  }

  playNotificationSound() {
    const audio = new Audio('/assets/notification.mp3'); // Place the sound file in `src/assets/`
    audio.volume = 1.0; // Max volume
    audio.play().catch(err => console.error("🔇 Sound play blocked:", err));
  }
}
