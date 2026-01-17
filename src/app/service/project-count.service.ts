import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectCountService {

  private countSource = new BehaviorSubject<number>(0);

  currentCount$ = this.countSource.asObservable();

  setCount(count: number) {
    console.log("COUNT SERVICE======>>", count);
    this.countSource.next(count);
  }

  constructor() { }

  getEmployeeFromCode(code: string): string {
    if (!code) return '';

    if (code.startsWith('SEND_BY_')) {
      return code.replace('SEND_BY_', '');
    }

    if (code.startsWith('RECEIVED_TO_')) {
      return code.replace('RECEIVED_TO_', '');
    }

    return '';
  }

  getEmployeeFromStatus(statusArray: any[], senderName: string): string {

    const send = statusArray?.find((s: any) =>
      s.code?.startsWith('SEND_BY_')
    );

    return send
      ? this.getEmployeeFromCode(send.code)
      : senderName;
  }

  // ───── TUMHARA EXACT RULE ─────
  isCountable(entity: any, senderName: string, isAdmin: boolean): boolean {

    const status = entity?.status || [];

    // ─── ADMIN MODE ───
    if (isAdmin) {

      const A = status.some((s: any) =>
        s.code.startsWith('SEND_BY_'));

      const B = status.some((s: any) =>
        s.code === 'SEND_BY_SHIVA_SIR');

      const C = status.some((s: any) =>
        s.code === 'RECEIVED_TO_SHIVA_SIR');

      const D = status.some((s: any) =>
        s.code.startsWith('RECEIVED_TO_'));

      return A && (C || !B) && !D;
    }

    // ─── EMPLOYEE MODE ───
    const emp = this.getEmployeeFromStatus(status, senderName);

    const A = status.some((s: any) =>
      s.code === `SEND_BY_${emp}`);

    const B = status.some((s: any) =>
      s.code === 'SEND_BY_SHIVA_SIR');

    const C = status.some((s: any) =>
      s.code === 'RECEIVED_TO_SHIVA_SIR');

    const D = status.some((s: any) =>
      s.code === `RECEIVED_TO_${emp}`);

    return A && (C || !B) && !D;
  }

  // ───── TOTAL COUNT ─────
  calculateTotal(
    list: any[],
    senderName: string,
    isAdmin: boolean
  ): number {

    let count = 0;

    list.forEach((user: any) => {

      if (this.isCountable(user, senderName, isAdmin)) {
        count++;
      }

      user.subEntries?.forEach((sub: any) => {
        if (this.isCountable(sub, senderName, isAdmin)) {
          count++;
        }
      });

    });
    return count;
  }

}
