import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { LogoutComponent } from './logout/logout.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { SalesHomeComponent } from './sales-home/sales-home.component';
import { SalesSideNavComponent } from './sales-side-nav/sales-side-nav.component';
import { SalesNavbarComponent } from './sales-navbar/sales-navbar.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'navbar',
        component: NavbarComponent
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'newEmployee',
        component: NewEmployeeComponent
      },
      
    ]
  },
  {
    path: 'salesHome',
    component: SalesHomeComponent,
    children: [
      {
        path: 'salesDashboard',
        component: SalesDashboardComponent
      },
      {
        path: 'salesNavbar',
        component: SalesNavbarComponent
      },
      {
        path: 'salesSideNav',
        component: SalesSideNavComponent
      },
      {
        path: 'newCustomer',
        component: NewCustomerComponent
      },
      {
        path: 'updateCustomer/:id',
        component: UpdateCustomerComponent
      }
    ]
  }
  
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
