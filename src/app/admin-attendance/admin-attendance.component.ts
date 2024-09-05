import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor

interface Attendance {
  username: string;
  attendance: { date: string; status: string; totalLoggedInTime: string }[];
}

@Component({
  selector: 'app-admin-attendance',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './admin-attendance.component.html',
  styleUrl: './admin-attendance.component.css'
})
export class AdminAttendanceComponent implements OnInit {

  // year: number = new Date().getFullYear();
  // month: number = new Date().getMonth() + 1; // Current month
  month: number;
  year: number;
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  attendanceData: Attendance[] = [];

  constructor(private auth: AuthService) {
    const today = new Date();
    this.month = today.getMonth() + 1; // Month is 0-indexed in JavaScript, so add 1
    this.year = today.getFullYear();
  }

  ngOnInit(): void {
    this.fetchAttendance();
  }

  // Method to fetch attendance data from the service
  fetchAttendance(): void {
    this.auth.getAttendance(this.year, this.month).subscribe(
      response => {
        if (response.success) {
          this.attendanceData = response.data;
          console.log("ATTENDANCE=====>>", this.attendanceData);
        } else {
          console.error('Failed to fetch attendance data:', response.message);
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
    this.fetchAttendance(); // Fetch data for the new month
  }

  // Navigate to the next month
  nextMonth(): void {
    if (this.month === 12) {
      this.month = 1;
      this.year++;
    } else {
      this.month++;
    }
    this.fetchAttendance(); // Fetch data for the new month
  }
}
