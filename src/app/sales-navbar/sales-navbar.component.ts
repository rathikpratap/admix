import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-navbar',
  templateUrl: './sales-navbar.component.html',
  styleUrls: ['./sales-navbar.component.css']
})
export class SalesNavbarComponent {
 
  tok:any;

  @Output() salesSideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private auth:AuthService, private router: Router){
    this.auth.getProfile().subscribe((res:any)=>{
      this.tok = res?.data;
    })
  }

  SalesSideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.salesSideNavToggled.emit(this.menuStatus);
  }
  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
 
}
