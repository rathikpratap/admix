import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface AttendanceEntry {
  date: string;
  status: string;
}

interface AttendanceData {
  username: string;
  attendance: AttendanceEntry[];
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
  errorMessage: string = '';

  constructor(private auth: AuthService,private toastr: ToastrService) {
    const today = new Date();
    this.month = today.getMonth() + 1;
    this.year = today.getFullYear();
  }

  ngOnInit(): void {
    this.fetchAttendance();
  }

  fetchAttendance(): void {
    this.auth.getAttendance1(this.year, this.month).subscribe(
      response => {
        if (response.success) {
          this.attendanceData = response.data;
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

  // saveAttendance(): void {
  //   this.attendanceData.forEach(user => {
  //     this.auth.updateAttendance(user.username, this.year, this.month, user.attendance).subscribe(
  //       response => {
  //         if (response.success) {
  //           console.log('Attendance saved successfully.');
  //         } else {
  //           console.log('Failed to save attendance.');
  //         }
  //       },
  //       error => {
  //         console.error('Error saving attendance:', error);
  //         console.log('Error saving attendance.');
  //       } 
  //     );
  //   });
  // }

  saveAttendance(userIndex?: number): void {
    // Save attendance for a single user if userIndex is passed, else save all users.
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

  // showSuccess() {
  //   this.toastr.success('Hello world!', 'Toastr fun!');
  // }

}
