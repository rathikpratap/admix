import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
    UpdatePaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
