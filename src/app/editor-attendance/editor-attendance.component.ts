import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

interface AttendanceEntry{
  date: string;
  status: string;
}

interface AttendanceData{
  username: string;
  attendance: AttendanceEntry[];
}

@Component({
  selector: 'app-editor-attendance', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-attendance.component.html',
  styleUrl: './editor-attendance.component.css'
})
export class EditorAttendanceComponent implements OnInit {

  month: number;
  year: number;
  monthNames= ["January","February","March","April","May","June","July","August","September","October","November","December"];
  weekDays= ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  attendanceData: AttendanceData[]=[];
  calendarDays: any[]=[];
  errorMessage: string='';

  ngOnInit(): void {
    this.fetchAttendance();
  }

  constructor(private auth: AuthService, private toastr: ToastrService){
    const today = new Date();
    this.month = today.getMonth()+1;
    this.year = today.getFullYear();
  }

  fetchAttendance():void{
    this.auth.getUserAttendance(this.year, this.month).subscribe((res:any)=>{
      if(res.success){
        this.attendanceData = res.data;
        this.generateCalendar();
      }else{
        this.toastr.error("No attendace Data Found","error");
      }
    });
  }

  generateCalendar(){
    const firstDayOfMonth = new Date(this.year, this.month -1,1);
    const lastDayOfMonth = new Date(this.year,this.month,0);
    const startDay = firstDayOfMonth.getDate() || 7;
    const totalDays = lastDayOfMonth.getDate();

    this.calendarDays = [];

    for(let i=1; i<startDay; i++){
      this.calendarDays.push({date: null});
    }

    for(let day=1; day <= totalDays; day++){
      const date = new Date(this.year, this.month -1, day).toISOString().split('T')[0];
      const attendace = this.attendanceData[0].attendance.find(att=> att.date === date);

      this.calendarDays.push({
        date: date,
        attendace: attendace || {status: "select"}
      });
    }

    while(this.calendarDays.length % 7 !== 0){
      this.calendarDays.push({date:null});
    }
  }

  prevMonth():void{
    if(this.month === 1){
      this.month =12;
      this.year--;
    }else{
      this.month--;
    }
    this.fetchAttendance();
  }

  nextMonth():void{
    if(this.month === 12){
      this.month = 1;
      this.year++;
    }else{
      this.month++;
    }
    this.fetchAttendance();
  } 
}
