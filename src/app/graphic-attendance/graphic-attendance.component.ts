import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

// interface AttendanceEntry{
//   date: string, 
//   status: string
// }

// interface AttendanceData{
//   username: string;
//   attendance: AttendanceEntry[];
// }

@Component({
  selector: 'app-graphic-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graphic-attendance.component.html',
  styleUrl: './graphic-attendance.component.css'
})
export class GraphicAttendanceComponent implements OnInit {

//   month: number;
//   year: number;
//   monthNames= ["January","February","March","April","May","June","July","August","September","October","November","December"];
//   weekDays= ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
//   attendanceData: AttendanceData[]=[];
//   calendarDays: any[]=[];
//   errorMessage: string='';

//   ngOnInit(): void {
//     this.fetchAttendance();
//   };

//   constructor(private auth: AuthService, private toastr: ToastrService){
//     const today = new Date();
//     this.month = today.getMonth()+1;
//     this.year = today.getFullYear();
//   }

//   fetchAttendance():void{
//     this.auth.getUserAttendance(this.year, this.month).subscribe((res:any)=>{
//       if(res.success){
//         this.attendanceData = res.data;
//         this.generateCalendar();
//       }else{
//         this.toastr.error("No attendance Data Found","error");
//       }
//     });
//   }

//   generateCalendar(){
//     const firstDayOfMonth = new Date(this.year, this.month -1,1);
//     const lastDayOfMonth = new Date(this.year, this.month, 0);
//     const startDay = firstDayOfMonth.getDate() || 7;
//     const totalDays = lastDayOfMonth.getDate();

//     this.calendarDays = [];

//     for(let i=1; i<startDay; i++){
//       this.calendarDays.push({date:null});
//     }

//     for( let day =1; day <= totalDays; day++){
//       const date = new Date(this.year, this.month -1, day).toISOString().split('T')[0];
//       const attendance = this.attendanceData[0].attendance.find(att=> att.date === date);

//       this.calendarDays.push({
//         date: date,
//         attendance: attendance || { status: "select"}
//       });
//     }

//     while(this.calendarDays.length % 7 !== 0){
//       this.calendarDays.push({date: null});
//     }
//   }

//   prevMonth():void{
//     if(this.month === 1){
//       this.month = 12;
//       this.year--;
//     }else{
//       this.month--;
//     }
//     this.fetchAttendance();
//   }

//   nextMonth():void{
//     if(this.month === 12){
//       this.month = 1;
//       this.year++;
//     }else{
//       this.month++;
//     }
//     this.fetchAttendance();
//   }
// }
year: number;
  month: number;
  today: Date = new Date();
  currentTime: string = '';
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  calendarDays: any[] = [];
  attendanceData: any[] = [];

  constructor(private auth: AuthService, private toastr: ToastrService) {
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth() + 1; // Month is 0-indexed in JS
  }

  ngOnInit() {
    this.fetchAttendance();
    setInterval(() => {
      this.updateTime();
    }, 1000); // Update clock every second
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  fetchAttendance(): void {
    console.log("Fetching attendance for:", this.year, this.month);
    
    this.auth.getUserAttendance(this.year, this.month).subscribe({
      next: (res: any) => {
        console.log("API Response:", res); // Log response data
  
        if (res && res.success && res.data) {
          this.attendanceData = res.data;
          this.generateCalendar();
        } else {
          this.toastr.error("No attendance data found", "Error");
        }
      },
      error: (err) => {
        console.error("API Error:", err);
        this.toastr.error("Failed to fetch attendance. Please try again.", "Error");
      }
    });
  }  
  

  generateCalendar() {
    this.calendarDays = [];
    const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
    const lastDate = new Date(this.year, this.month, 0).getDate();

    for (let i = 1; i < firstDayOfMonth; i++) {
      this.calendarDays.push(null);
    }

    for (let day = 1; day <= lastDate; day++) {
      const date = new Date(this.year, this.month - 1, day + 1).toISOString().split('T')[0];
      const attendance = this.attendanceData?.[0]?.attendance?.find((att:any) => att.date === date);
      const isToday = this.today.getFullYear() === this.year &&
                      this.today.getMonth() + 1 === this.month &&
                      this.today.getDate() === day;

      this.calendarDays.push({
        date: day,
        status: attendance ? attendance.status : 'Select',
        isToday: isToday
      });
    }
  }

  prevMonth() {
    if (this.month === 1) {
      this.year--;
      this.month = 12;
    } else {
      this.month--;
    }
    this.fetchAttendance();
  }

  nextMonth() {
    if (this.month === 12) {
      this.year++;
      this.month = 1;
    } else {
      this.month++;
    }
    this.fetchAttendance();
  }
}
