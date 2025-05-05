import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000');
  }
  onReminder(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('call-reminder', (data) => {
        observer.next(data);
      });
    });
  }
  registerUser(username: string): void {
    this.socket.emit('register-user', username);
  }
  snoozeReminder(reminder: any): void {
    this.socket.emit('snooze-reminder', {
      number: reminder.number,
      name: reminder.name
    });
  }
}
