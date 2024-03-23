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
import { AllCustomersComponent } from './all-customers/all-customers.component';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { FacebookLeadsComponent } from './facebook-leads/facebook-leads.component';
import { SalesLeadsComponent } from './sales-leads/sales-leads.component';
import { LeadsComponent } from './leads/leads.component';

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
      {
        path: 'allEmployees',
        component: AllEmployeesComponent
      },
      {
        path: 'all-projects',
        component: AllProjectsComponent
      },
      {
        path: 'updateEmployee/:id',
        component: UpdateEmployeeComponent
      },
      {
        path: 'new-category',
        component: NewCategoryComponent
      },
      {
        path: 'facebook-leads',
        component: FacebookLeadsComponent
      },
      {
        path: 'Leads',
        component: LeadsComponent
      }
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
      },
      {
        path: 'allCustomers',
        component: AllCustomersComponent
      },
      {
        path: 'sales-leads',
        component: SalesLeadsComponent
      }
    ]
  }
  
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
