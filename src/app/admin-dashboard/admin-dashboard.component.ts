import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {


  data:any=[];
  allData:any=[];

  constructor(private auth: AuthService) {
    this.auth.getAllProjects().subscribe((allList : any)=>{
      console.log("allList",allList)
      this.data = allList;
      console.log('loag ==>', this.data);
      
    })

    this.auth.getAllCompleteProjects().subscribe((allProject : any)=>{
      console.log("allProject",allProject)
      this.allData = allProject;
    })

  }
}
