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
import { EditorHomeComponent } from './editor-home/editor-home.component';
import { EditorDashboardComponent } from './editor-dashboard/editor-dashboard.component';
import { ScriptHomeComponent } from './script-home/script-home.component';
import { ScriptDashboardComponent } from './script-dashboard/script-dashboard.component';
import { VoHomeComponent } from './vo-home/vo-home.component';
import { VoDashboardComponent } from './vo-dashboard/vo-dashboard.component';
import { EditorNavbarComponent } from './editor-navbar/editor-navbar.component';
import { EditorSidenavComponent } from './editor-sidenav/editor-sidenav.component';
import { ScriptNavbarComponent } from './script-navbar/script-navbar.component';
import { ScriptSidenavComponent } from './script-sidenav/script-sidenav.component';
import { VoNavbarComponent } from './vo-navbar/vo-navbar.component';
import { VoSidenavComponent } from './vo-sidenav/vo-sidenav.component';
import { ScriptUpdateComponent } from './script-update/script-update.component';
import { EditorUpdateComponent } from './editor-update/editor-update.component';
import { VoUpdateComponent } from './vo-update/vo-update.component';
import { TeamLeadsComponent } from './team-leads/team-leads.component';
import { AuthGuard } from './auth.guard';
import { UpdatePanelComponent } from './update-panel/update-panel.component';
import { PaymentComponent } from './payment/payment.component';
import { UpdatePaymentComponent } from './update-payment/update-payment.component';
import { SalesWorkComponent } from './sales-work/sales-work.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { FbAccessTokenComponent } from './fb-access-token/fb-access-token.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { ScriptProjectsComponent } from './script-projects/script-projects.component';
import { VoProjectsComponent } from './vo-projects/vo-projects.component';
import { EditorProjectsComponent } from './editor-projects/editor-projects.component';
import { EditorOtherComponent } from './editor-other/editor-other.component';
import { EditorOtherProjectsComponent } from './editor-other-projects/editor-other-projects.component';

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
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms&consitions',
    component: TermsConditionComponent
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
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
      },
      {
        path: 'update-panel/:id',
        component: UpdatePanelComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'update-payment/:id',
        component: UpdatePaymentComponent
      },
      {
        path: 'sales-work',
        component: SalesWorkComponent
      },
      {
        path: 'fb-accessToken',
        component: FbAccessTokenComponent
      },
      {
        path: 'add-company',
        component: AddCompanyComponent
      }
    ]
  },
  {
    path: 'salesHome',
    component: SalesHomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'salesDashboard',
        component: SalesDashboardComponent,
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
      },
      {
        path: 'team-leads',
        component: TeamLeadsComponent
      }
    ]
  },
  {
    path: 'editor-home',
    component: EditorHomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'editor-dashboard',
        component: EditorDashboardComponent
      },
      {
        path: 'editor-navbar',
        component: EditorNavbarComponent
      },
      {
        path: 'editor-sidenav',
        component: EditorSidenavComponent
      },
      {
        path: 'editor-update/:id',
        component: EditorUpdateComponent
      },
      {
        path: 'editor-projects',
        component: EditorProjectsComponent
      },
      {
        path: 'editor-other',
        component: EditorOtherComponent
      },
      {
        path: 'editor-otherProjects',
        component: EditorOtherProjectsComponent
      }
    ]
  },
  {
    path: 'script-home',
    component: ScriptHomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'script-dashboard',
        component: ScriptDashboardComponent
      },
      {
        path: 'script-navbar',
        component: ScriptNavbarComponent
      },
      {
        path: 'script-sidenav',
        component: ScriptSidenavComponent
      },
      {
        path: 'script-update/:id',
        component: ScriptUpdateComponent
      },
      {
        path: 'script-projects',
        component: ScriptProjectsComponent
      }
    ]
  },
  {
    path: 'vo-home',
    component: VoHomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'vo-dashboard',
        component: VoDashboardComponent
      },
      {
        path: 'vo-navbar',
        component: VoNavbarComponent
      },
      {
        path: 'vo-sidenav',
        component: VoSidenavComponent
      },
      {
        path: 'vo-update/:id',
        component: VoUpdateComponent
      },
      {
        path: 'vo-projects',
        component: VoProjectsComponent
      }
    ]
  }
  
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
