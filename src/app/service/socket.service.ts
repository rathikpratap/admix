// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {
//   private socket: Socket;

//   constructor() {
//      this.socket = io('http://localhost:5000',{
//     //this.socket = io('https://www.login.admixmedia.in',{
//       transports: ['websocket'],
//       withCredentials: true
//     });
//   }
//   onReminder(): Observable<any> {
//     return new Observable(observer => {
//       this.socket.on('call-reminder', (data) => {
//         observer.next(data);
//       });
//     });
//   }
//   registerUser(username: string): void {
//     this.socket.emit('register-user', username);
//   }
//   snoozeReminder(reminder: any): void {
//     this.socket.emit('snooze-reminder', {
//       number: reminder.number,
//       name: reminder.name
//     });
//   }
// }


import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface CallReminder {
  _id: string;
  name: string;
  number: string | number;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  // Local
  //private socketUrl = 'http://localhost:5000';

  // Production mein:
  private socketUrl = 'https://www.login.admixmedia.in';

  constructor() {

    this.socket = io(this.socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);

      // Agar user already login hai aur socket reconnect hua
      const username = localStorage.getItem('name');

      if (username) {
        this.registerUser(username);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    this.socket.on('snooze-success', (data) => {
      console.log('✅ Snooze success:', data);
    });

    this.socket.on('snooze-error', (data) => {
      console.error('❌ Snooze error:', data);
    });
  }

  registerUser(username: string): void {

    if (!username) {
      console.warn('⚠️ Username missing');
      return;
    }

    console.log('📌 Registering user:', username);

    this.socket.emit('register-user', username);
  }

  onReminder(): Observable<CallReminder> {

    return new Observable(observer => {

      const handler = (data: CallReminder) => {

        console.log('🔔 REMINDER RECEIVED:', data);

        observer.next(data);
      };

      this.socket.on('call-reminder', handler);

      // unsubscribe hone par listener remove
      return () => {
        this.socket.off('call-reminder', handler);
      };
    });
  }

  snoozeReminder(reminder: CallReminder): void {

    console.log('😴 Snoozing reminder:', reminder);

    this.socket.emit('snooze-reminder', {
      _id: reminder._id
    });
  }
}