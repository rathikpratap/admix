import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { LogoutComponent } from './logout/logout.component';
import {HttpClientModule} from '@angular/common/http';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { SalesSideNavComponent } from './sales-side-nav/sales-side-nav.component';
import { SalesHomeComponent } from './sales-home/sales-home.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EditorHomeComponent } from './editor-home/editor-home.component';
import { EditorDashboardComponent } from './editor-dashboard/editor-dashboard.component';
import { ScriptHomeComponent } from './script-home/script-home.component';
import { ScriptDashboardComponent } from './script-dashboard/script-dashboard.component';
import { VoHomeComponent } from './vo-home/vo-home.component';
import { VoDashboardComponent } from './vo-dashboard/vo-dashboard.component';
import { VoNavbarComponent } from './vo-navbar/vo-navbar.component';
import { ScriptNavbarComponent } from './script-navbar/script-navbar.component';
import { EditorNavbarComponent } from './editor-navbar/editor-navbar.component';
import { EditorSidenavComponent } from './editor-sidenav/editor-sidenav.component';
import { ScriptSidenavComponent } from './script-sidenav/script-sidenav.component';
import { VoSidenavComponent } from './vo-sidenav/vo-sidenav.component';
import { ScriptUpdateComponent } from './script-update/script-update.component';
import { EditorUpdateComponent } from './editor-update/editor-update.component';
import { VoUpdateComponent } from './vo-update/vo-update.component';
import { TeamLeadsComponent } from './team-leads/team-leads.component';
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


 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SideNavComponent,
    AdminDashboardComponent,
    HomeComponent,
    NewEmployeeComponent,
    LogoutComponent,
    NewCustomerComponent,
    SalesSideNavComponent,
    SalesHomeComponent,
    SalesNavbarComponent,
    SalesDashboardComponent,
    UpdateCustomerComponent,
    AllCustomersComponent,
    AllEmployeesComponent,
    AllProjectsComponent,
    UpdateEmployeeComponent,
    NewCategoryComponent,
    FacebookLeadsComponent,
    SalesLeadsComponent,
    LeadsComponent,
    EditorHomeComponent,
    EditorDashboardComponent,
    ScriptHomeComponent,
    ScriptDashboardComponent,
    VoHomeComponent,
    VoDashboardComponent,
    VoNavbarComponent,
    ScriptNavbarComponent,
    EditorNavbarComponent,
    EditorSidenavComponent,
    ScriptSidenavComponent,
    VoSidenavComponent,
    ScriptUpdateComponent,
    EditorUpdateComponent,
    VoUpdateComponent,
    TeamLeadsComponent,
    UpdatePanelComponent,
    PaymentComponent,
    UpdatePaymentComponent,
    SalesWorkComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent,
    FbAccessTokenComponent,
    AddCompanyComponent,
    ScriptProjectsComponent,
    VoProjectsComponent,
    EditorProjectsComponent,
    EditorOtherComponent,
    EditorOtherProjectsComponent,
    B2bDashboardComponent,
    B2bProjectsComponent,
    UpdateB2bComponent,
    EditorB2bUpdateComponent,
    CustomLeadsComponent,
    PayrollComponent,
    EditorPayrollComponent,
    ScriptPayrollComponent,
    VoPayrollComponent,
    B2bPayrollComponent,
    AllPayrollComponent,
    AddPaymentComponent,
    EstInvoiceComponent,
    WhatsAppLeadsComponent,
    MainInvoiceComponent,
    AdminWhatsAppLeadsComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //ToastrModule.forRoot()
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
