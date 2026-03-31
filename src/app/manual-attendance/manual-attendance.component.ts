import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface AttendanceEntry {
  date: string;
  status: string;
  reason: string;
}
interface AttendanceEntryNew {
  date: string;
  status: string;
  reason: string;
}
 
interface AttendanceData {
  username: string;
  attendance: AttendanceEntry[];
  totalPresent: number;
  totalAbsent: number;
  totalHalfday: number;
}
interface AttendanceDataNew {
  username: string;
  attendance1: AttendanceEntryNew[];
  totalPresent: number;
  totalAbsent: number;
  totalHalfday: number;
}

@Component({
  selector: 'app-manual-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manual-attendance.component.html',
  styleUrl: './manual-attendance.component.css'
})
export class ManualAttendanceComponent implements OnInit {

  month: number;
  year: number;
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  attendanceData: AttendanceData[] = [];
  attendanceDataNew: AttendanceDataNew[] = [];
  errorMessage: string = '';

  constructor(private auth: AuthService,private toastr: ToastrService) {
    const today = new Date();
    this.month = today.getMonth() + 1;
    this.year = today.getFullYear();
  }

  ngOnInit(): void {
    this.fetchAttendance();
    this.fetchAttendanceNew();
  }

  fetchAttendance(): void {
    this.auth.getAttendance1(this.year, this.month).subscribe(
      response => {
        if (response.success) {
          this.attendanceData = response.data.map(user => ({
            ...user,
            attendance: user.attendance.map(day => ({
              ...day,
              reason: day.reason || ''
            }))
          }));
          console.log("ATTENDANCE=====>>", this.attendanceData);
        } else {
          console.error('Failed to fetch attendance data:'); 
        }
      },
      error => {
        console.error('Error fetching attendance data:', error);
      }
    );
  }

  prevMonth(): void {
    if (this.month === 1) {
      this.month = 12;
      this.year--;
    } else {
      this.month--;
    }
    this.fetchAttendance();
  }

  nextMonth(): void {
    if (this.month === 12) {
      this.month = 1;
      this.year++;
    } else {
      this.month++;
    }
    this.fetchAttendance();
  }

  saveAttendance(userIndex?: number): void {
    if (userIndex !== undefined) {
      const user = this.attendanceData[userIndex];
      this.auth.updateAttendance(user.username, this.year, this.month, user.attendance).subscribe(
        response => {
          if (response.success) {
            console.log(`Attendance for ${user.username} saved successfully.`);
            this.toastr.success(`Attendance for ${user.username} saved successfully.`, 'Success');
          } else {
            console.log(`Failed to save attendance for ${user.username}.`);
          }
        },
        error => {
          console.error(`Error saving attendance for ${user.username}:`, error);
        }
      );
    } else {
      this.attendanceData.forEach(user => {
        this.auth.updateAttendance(user.username, this.year, this.month, user.attendance).subscribe(
          response => {
            if (response.success) {
              console.log(`Attendance for ${user.username} saved successfully.`);
            } else {
              console.log(`Failed to save attendance for ${user.username}.`);
            }
          },
          error => {
            console.error(`Error saving attendance for ${user.username}:`, error);
          }
        );
      });
    }
  }

  updateAttendance(userIndex: number, dayIndex: number, status: string): void {
    this.attendanceData[userIndex].attendance[dayIndex].status = status;
    this.recalculateData(userIndex);
    this.saveAttendance(userIndex);
  }

  recalculateData(userIndex: number) {
    const user = this.attendanceData[userIndex];
    let totalPresent = 0, totalAbsent = 0, totalHalfday = 0;

    user.attendance.forEach(day => {
      if (day.status === 'Present') totalPresent++;
      if (day.status === 'Absent') totalAbsent++; 
      if (day.status === 'Half Day') totalHalfday++;
    });

    this.attendanceData[userIndex].totalPresent = totalPresent;
    this.attendanceData[userIndex].totalAbsent = totalAbsent;
    this.attendanceData[userIndex].totalHalfday = totalHalfday;
  }

//New New

fetchAttendanceNew(): void {
    this.auth.getAttendance1New(this.year, this.month).subscribe(
      response => {
        if (response.success) {
          this.attendanceDataNew = response.data.map(user => ({
            ...user,
            attendance1: user.attendance.map(day => ({
              ...day,
              reason: day.reason || ''
            }))
          }));
          console.log("ATTENDANCE NEW=====>>", this.attendanceDataNew);
        } else {
          console.error('Failed to fetch attendance New data:'); 
        }
      },
      error => {
        console.error('Error fetching attendance New data:', error);
      }
    );
  }

  prevMonthNew(): void {
    if (this.month === 1) {
      this.month = 12;
      this.year--;
    } else {
      this.month--;
    }
    this.fetchAttendanceNew();
  }

  nextMonthNew(): void {
    if (this.month === 12) {
      this.month = 1;
      this.year++;
    } else {
      this.month++;
    }
    this.fetchAttendanceNew();
  }

  updateAttendanceNew(userIndex: number) {
    console.log("IM HIT");
    this.recalculateDataNew(userIndex);
    this.saveAttendanceNew(userIndex);
  }

  // 🔹 Save button per call
  saveAttendanceNew(userIndex: number): void {
    const user = this.attendanceDataNew[userIndex];
    console.log("🔥 Sending:", user);

    this.auth.updateAttendanceNew(user.username, this.year, this.month, user.attendance1)
      .subscribe((res: any) => {
        if (res.success) {
          this.toastr.success("Saved successfully");
        }
      });
  }

  recalculateDataNew(userIndex: number) {
    const user = this.attendanceDataNew[userIndex];

    let p = 0, a = 0, h = 0;

    user.attendance1.forEach(day => {
      if (day.status.includes('Present')) p++;
      if (day.status === 'Absent') a++;
      if (day.status.includes('Half Day')) h++;
    });

    user.totalPresent = p;
    user.totalAbsent = a;
    user.totalHalfday = h;
  }

}

// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../service/auth.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';

// interface AttendanceEntry {
//   date: string;
//   status: string;
//   reason: string;
// }

// interface AttendanceData {
//   username: string;
//   attendance: AttendanceEntry[];
//   totalPresent: number;
//   totalAbsent: number;
//   totalHalfday: number;
// }

// @Component({
//   selector: 'app-manual-attendance',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './manual-attendance.component.html',
//   styleUrl: './manual-attendance.component.css'
// })
// export class ManualAttendanceComponent implements OnInit {

  // month: number;
  // year: number;

  // monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // attendanceData: AttendanceData[] = [];

  // constructor(private auth: AuthService, private toastr: ToastrService) {
  //   const today = new Date();
  //   this.month = today.getMonth() + 1;
  //   this.year = today.getFullYear();
  // }

  // ngOnInit(): void {
  //   this.fetchAttendance();
  // }

  // fetchAttendance(): void {
  //   this.auth.getAttendance1(this.year, this.month).subscribe(
  //     (response: any) => {
  //       if (response.success) {
  //         this.attendanceData = response.data.map((user: any) => ({
  //           ...user,
  //           attendance: user.attendance.map((day: any) => ({
  //             ...day,
  //             reason: day.reason || ''
  //           }))
  //         }));
  //       }
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // 🔹 Only local update
  

  // prevMonth() {
  //   if (this.month === 1) {
  //     this.month = 12;
  //     this.year--;
  //   } else this.month--;

  //   this.fetchAttendance();
  // }

  // nextMonth() {
  //   if (this.month === 12) {
  //     this.month = 1;
  //     this.year++;
  //   } else this.month++;

  //   this.fetchAttendance();
  // }
