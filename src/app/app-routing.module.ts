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
import { B2bDashboardComponent } from './b2b-dashboard/b2b-dashboard.component';
import { B2bProjectsComponent } from './b2b-projects/b2b-projects.component';
import { UpdateB2bComponent } from './update-b2b/update-b2b.component';
import { EditorB2bUpdateComponent } from './editor-b2b-update/editor-b2b-update.component';
import { CustomLeadsComponent } from './custom-leads/custom-leads.component';
import { PayrollComponent } from './payroll/payroll.component';
import { EditorPayrollComponent } from './editor-payroll/editor-payroll.component';
import { ScriptPayrollComponent } from './script-payroll/script-payroll.component';
import { VoPayrollComponent } from './vo-payroll/vo-payroll.component';
import { B2bPayrollComponent } from './b2b-payroll/b2b-payroll.component';
import { AllPayrollComponent } from './all-payroll/all-payroll.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { EstInvoiceComponent } from './est-invoice/est-invoice.component';
import { WhatsAppLeadsComponent } from './whats-app-leads/whats-app-leads.component';
import { MainInvoiceComponent } from './main-invoice/main-invoice.component';
import { AdminWhatsAppLeadsComponent } from './admin-whats-app-leads/admin-whats-app-leads.component';
import { AdminAttendanceComponent } from './admin-attendance/admin-attendance.component';
import { ManualAttendanceComponent } from './manual-attendance/manual-attendance.component';
import { GraphicHomeComponent } from './graphic-home/graphic-home.component';
import { GraphicDashboardComponent } from './graphic-dashboard/graphic-dashboard.component';
import { GraphicNavbarComponent } from './graphic-navbar/graphic-navbar.component';
import { GraphicSidenavComponent } from './graphic-sidenav/graphic-sidenav.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { SalesNewTaskComponent } from './sales-new-task/sales-new-task.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { GraphicAttendanceComponent } from './graphic-attendance/graphic-attendance.component';
import { EditorAttendanceComponent } from './editor-attendance/editor-attendance.component';
import { DownloadInvoiceComponent } from './download-invoice/download-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { IncentiveComponent } from './incentive/incentive.component';
import { IncentiveCalculationComponent } from './incentive-calculation/incentive-calculation.component';
import { SalesIncentiveComponent } from './sales-incentive/sales-incentive.component';
import { BundleDashboardComponent } from './bundle-dashboard/bundle-dashboard.component';
import { BundleProjectsComponent } from './bundle-projects/bundle-projects.component';
import { TeamLeaderComponent } from './team-leader/team-leader.component';
import { TeamLeaderProjectsComponent } from './team-leader-projects/team-leader-projects.component';
import { SalesWorkTeamComponent } from './sales-work-team/sales-work-team.component';
import { NewB2bProjectsComponent } from './new-b2b-projects/new-b2b-projects.component';
import { AssignCampaignComponent } from './assign-campaign/assign-campaign.component';

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
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms&conditions',
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
      },
      {
        path: 'payroll',
        component: PayrollComponent
      },
      {
        path: 'b2b-payroll',
        component: B2bPayrollComponent
      },
      {
        path: 'all-payroll',
        component: AllPayrollComponent
      },
      {
        path: 'add-payment',
        component: AddPaymentComponent
      },
      {
        path: 'est-invoice/:id',
        component: EstInvoiceComponent
      },
      {
        path: 'main-invoice/:id',
        component: MainInvoiceComponent
      },
      {
        path: 'admin-WhatsAppLeads',
        component: AdminWhatsAppLeadsComponent
      },
      {
        path: 'admin-attendance',
        component: AdminAttendanceComponent
      },
      {
        path: 'manual-attendance',
        component: ManualAttendanceComponent
      },
      {
        path: 'new-task',
        component: NewTaskComponent
      },
      // {
      //   path: 'download_invoice',
      //   component: DownloadInvoiceComponent
      // },
      // {
      //   path: 'viewInvoice/:id',
      //   component: ViewInvoiceComponent
      // },
      {
        path: 'incentive',
        component: IncentiveComponent
      },
      {
        path: 'incentive-calculation',
        component: IncentiveCalculationComponent
      },
      {
        path: 'b2b-dashboard',
        component: B2bDashboardComponent
      },
      {
        path: 'b2b-projects',
        component: B2bProjectsComponent
      },
      {
        path: 'newB2b-projects',
        component: NewB2bProjectsComponent
      },
      {
        path: 'update-b2b/:id',
        component: UpdateB2bComponent
      },
      {
        path: 'assign-campaign',
        component: AssignCampaignComponent
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
        path: 'logout',
        component: LogoutComponent
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
      },
      {
        path: 'custom-leads',
        component: CustomLeadsComponent
      },
      {
        path: 'whatsApp-leads',
        component: WhatsAppLeadsComponent
      },
      {
        path: 'est-invoice/:id',
        component: EstInvoiceComponent
      },
      {
        path: 'main-invoice/:id',
        component: MainInvoiceComponent
      },
      {
        path: 'sales-new-task',
        component: SalesNewTaskComponent
      },
      {
        path: 'attendance',
        component: AttendanceComponent
      },
      {
        path: 'sales-incentive',
        component: SalesIncentiveComponent
      },
      {
        path: 'bundle-dashboard',
        component: BundleDashboardComponent
      },
      {
        path: 'bundle-projects',
        component: BundleProjectsComponent
      },
      {
        path: 'team-leader',
        component: TeamLeaderComponent
      },
      {
        path: 'team-leader-projects',
        component: TeamLeaderProjectsComponent
      },
      {
        path: 'sales-workTeam',
        component: SalesWorkTeamComponent
      },
      {
        path: 'download_invoice',
        component: DownloadInvoiceComponent
      },
      {
        path: 'viewInvoice/:id',
        component: ViewInvoiceComponent
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
      },
      {
        path: 'editor-b2b-update/:id',
        component: EditorB2bUpdateComponent
      },
      {
        path: 'editor-payroll',
        component: EditorPayrollComponent
      },
      {
        path: 'editor-attendance',
        component: EditorAttendanceComponent
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
      },
      {
        path: 'script-payroll',
        component: ScriptPayrollComponent
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
      },
      {
        path: 'vo-payroll',
        component: VoPayrollComponent
      }
    ]
  },
  {
    path: 'graphic-home',
    component: GraphicHomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'graphic-dashboard',
        component: GraphicDashboardComponent
      },
      {
        path: 'graphic-navbar',
        component: GraphicNavbarComponent
      },
      {
        path: 'graphic-sidenav',
        component: GraphicSidenavComponent
      },
      {
        path: 'graphic-attendance',
        component: GraphicAttendanceComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
