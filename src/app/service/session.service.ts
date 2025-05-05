import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private router: Router) { }

  handleLoginResponse(res: any) {
    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('roles', JSON.stringify(res.role));
      localStorage.setItem('name', res.name);
      const roles = res.role || [];
      const team = res.team;

      if (roles.includes('Admin') || roles.includes('Manager')) {
        this.router.navigateByUrl('/admin-dashboard');
      } else if (roles.includes('Sales Team')) {
        if (team === 'Shiva Development') {
          this.router.navigateByUrl('/salesHome/b2b-dashboard');
        } else {
          this.router.navigateByUrl('/salesHome/salesDashboard');
        }
      } else if (roles.includes('Script Writer')) {
        this.router.navigateByUrl('/script-home/script-dashboard');
      } else if (roles.includes('Editor')) {
        this.router.navigateByUrl('/editor-home/editor-dashboard');
      } else if (roles.includes('VO Artist')) {
        this.router.navigateByUrl('/vo-home/vo-dashboard');
      } else if (roles.includes('Graphic Designer')) {
        this.router.navigateByUrl('/graphic-home/graphic-dashboard');
      } else {
        alert('No matching role found!');
      }
    } else {
      alert(res.message);
    }
  }
}
