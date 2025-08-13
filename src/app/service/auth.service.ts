import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { appConfig } from 'src/environment';
import { Router } from '@angular/router';

interface AttendanceEntry {
  reason: string;
  date: string;
  status: string;
}

interface AttendanceData {
  username: string;
  attendance: AttendanceEntry[];
  totalPresent: number;
  totalAbsent: number;
  totalHalfday: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json')

  constructor(private http: HttpClient, private router: Router) { }

  signup(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/register`, data);
  }
  sendOtp(data: { username: string }) {
    return this.http.post(`${appConfig.apiUrl}/auth/send-otp`, data);
  }
  signin(credentials: { username: string, otp?: string | null}): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/login`, credentials);
  }
  

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    const token = localStorage.getItem('token'); // Get the JWT token from localStorage

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Call the backend API to save the logout time
      this.http.post(`${appConfig.apiUrl}/auth/logout`, {}, { headers }).subscribe(
        (response: any) => {
          if (response.success) {
            console.log('Logout time saved successfully.');
          } else {
            console.error('Failed to save logout time:', response.message);
          }

          // Remove the token and role from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('role');

          // Navigate to the login page
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error during logout API call:', error);

          // Remove the token and role from localStorage even if the API call fails
          localStorage.removeItem('token');
          localStorage.removeItem('role');

          // Navigate to the login page
          this.router.navigate(['/login']);
        }
      );
    } else {
      // If no token is found, simply redirect to login
      this.router.navigate(['/login']);
    }
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  addcustomer(customerData: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/customer`, customerData)
  }
  addB2b(customerData: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/b2bProject`, customerData);
  }
  addLead(customerData: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/customLead`, customerData);
  }
  addEstInvoice(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/estInvoice`, data);
  }
  updateInvoice(data: any): Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/updateInvoice`, data);
  }
  getCustData() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${appConfig.apiUrl}/auth/list`, { headers });
  };
  getCustDataB2b() {
    return this.http.get(`${appConfig.apiUrl}/auth/listB2b`);
  }
  getAllCustDataB2b() {
    return this.http.get(`${appConfig.apiUrl}/auth/allListB2b`);
  }
  getScriptData() {
    return this.http.get(`${appConfig.apiUrl}/auth/scriptActiveList`);
  }
  getVoData() {
    return this.http.get(`${appConfig.apiUrl}/auth/voActiveList`);
  }
  getEditorData() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorActiveList`);
  }
  getBundleData() {
    return this.http.get(`${appConfig.apiUrl}/auth/bundleActiveList`);
  }
  getCompleteScriptData() {
    return this.http.get(`${appConfig.apiUrl}/auth/scriptCompleteList`);
  }
  getEditorOtherData() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorOtherActiveList`);
  }
  getCompleteEditorOtherData() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorOtherCompleteList`);
  }
  getCompleteVoData() {
    return this.http.get(`${appConfig.apiUrl}/auth/voCompleteList`);
  }
  getCompleteEditorData() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorCompleteList`);
  }
  getCompleteBundleData() {
    return this.http.get(`${appConfig.apiUrl}/auth/bundleCompleteList`);
  }
  allProjectsSales(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'const-type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${appConfig.apiUrl}/auth/allList`, { headers });
  };
  allProjectsAdmin() {
    return this.http.get(`${appConfig.apiUrl}/auth/allListAdmin`);
  }
  getLeads() {
    return this.http.get(`${appConfig.apiUrl}/auth/getFacebook-leads`);
  }
  fetchLeads() {
    return this.http.get(`${appConfig.apiUrl}/auth/facebook-leads`);
  }
  salesFacebookLeads() {
    return this.http.get(`${appConfig.apiUrl}/auth/salesFacebook-leads`);
  }
  salesSecondFacebookLeads() {
    return this.http.get(`${appConfig.apiUrl}/auth/salesSecondFacebook-leads`);
  }
  getSalesFacebookLeads() {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFacebook-leads`);
  }
  updateSalesperson(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/update-salespersons`, { items: data });
  }

  // updateProjectStatus(data: any): Observable<any> {
  //   return this.http.post(`${appConfig.apiUrl}/auth/update-projectStatus`, { items: data });
  // }

  updateProjectStatus(data:any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${appConfig.apiUrl}/auth/update-projectStatus`,{ items: data}, {headers});
  }
  updateEditors(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/updateEditor`, { items: data });
  }
  updateSubEntry(parentId: string, subEntry: any): Observable<any> {
  return this.http.post(`${appConfig.apiUrl}/auth/updateSubEntry`, {
    parentId,
    subEntry
  });
}

  updateB2bEditorname(data:any): Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/updateB2bEditorname`,{items: data});
  }
  updateProjectStatusTeam(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/update-projectStatusTeam`, { items: data });
  }
  getCompleteProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/completeProject`);
  }
  getCompleteProjectsB2b() {
    return this.http.get(`${appConfig.apiUrl}/auth/completeProjectB2b`);
  }
  getAllCompleteProjectsB2b() {
    return this.http.get(`${appConfig.apiUrl}/auth/allCompleteProjectB2b`);
  }
  getAllProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allOngoingProjects`);
  }
  getAllProjectsExcludingLogo(){
    return this.http.get(`${appConfig.apiUrl}/auth/allOngoingProjectsExcludingLogo`);
  }
  getAllProjectsIncludingLogo(){
    return this.http.get(`${appConfig.apiUrl}/auth/allOngoingProjectsIncludingLogo`);
  }
  getProductionProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allProductionProjects`);
  }
  getAllCompleteProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allCompleteProjects`);
  }
  getremainingAmountProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/remainingAmountProjects`);
  }
  salesAllProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allProjects`);
  }
  salesPreviousMonthProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allPreviousProjects`);
  }
  salesPreviousTwoMonthProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allTwoPreviousProjects`);
  }
  empProjects(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/empProjects/${name}`);
  }
  getSalesClosing(closing: any, person: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/sales_closing/${closing}/${person}`);
  }
  empStatus(status: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/empStatus/${status}`);
  }
  getSalesClosingStatus(closing: any, person: any, status: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/sales_statusClosing/${closing}/${person}/${status}`);
  }
  getClosingStatus(closing: any, status: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/closing_status/${closing}/${status}`);
  }
  getSalesStatus(person: any, status: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/sales_status/${person}/${status}`);
  }

  empAllProjects(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/empAllProjects/${name}`);
  }
  empAllPrevMonth(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/empAllPrevProjects/${name}`);
  }
  empAllPrevTwoMonth(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/empAllTwoPrevProjects/${name}`);
  }
  closingData(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/allCategProjects/${name}`);
  }
  closingDataCurrentMonth(name: any): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/closingCurrentMonth/${name}`);
  }
  closingDataPrevMonth(name: any): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/closingPrevMonth/${name}`);
  }
  closingDataTwoPrevMonth(name:any): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/closingTwoPrevMonth/${name}`);
  }
  searchedClosingData(name: any, mobile:any): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/searchCategProjects/${name}/${mobile}`);
  }

  allProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allProjectsAdmin`);
  }
  allPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allPreviousProjectsAdmin`);
  }
  allTwoPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allTwoPreviousProjectsAdmin`);
  }
  monthRestAmount() {
    return this.http.get(`${appConfig.apiUrl}/auth/totalRecvAmount`);
  }

  dataLength() {
    return this.http.get(`${appConfig.apiUrl}/auth/dataLength`);
  };
  b2bDataLength() {
    return this.http.get(`${appConfig.apiUrl}/auth/b2bDataLength`);
  }

  allEmployee() {
    return this.http.get(`${appConfig.apiUrl}/auth/allEmployee`);
  }

  searchCustomerbyMobile(mobile: string): Observable<any> {
    return this.http.get<any>(`${appConfig.apiUrl}/auth/searchCustomer/${mobile}`);
  }

  searchCustomerbyMobileLeads(mobile: string): Observable<any> {
    return this.http.get<any>(`${appConfig.apiUrl}/auth/searchLeads/${mobile}`);
  }

  searchInvoice(mobile: string): Observable<any>{
    return this.http.get<any>(`${appConfig.apiUrl}/auth/searchInvoice/${mobile}`);
  }

  searchCustomerbyProject(projectStatus: string): Observable<any> {
    return this.http.get<any>(`${appConfig.apiUrl}/auth/customerProject/${projectStatus}`);
  }

  searchCustomerbyProjectName(projectName: string): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/customerProjectName/${projectName}`);
  }
  searchB2bByProjectName(projectName: string): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/B2bProjectName/${projectName}`);
  }
  searchPayment(editorCNR: string): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/editorPayroll/${editorCNR}`);
  }
  searchPaymentAll(editorCNR: string): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/payrollAll/${editorCNR}`);
  }
  searchPaymentScript(editorCNR: string): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/scriptPayroll/${editorCNR}`);
  }
  searchPaymentVo(editorCNR: string): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/voPayroll/${editorCNR}`);
  }

  getProfile() {
    let headers = {
      'Authorization': "Bearer " + localStorage.getItem('token')
    }
    return this.http.get(`${appConfig.apiUrl}/auth/profile`, { headers: headers })
  }

  updateCustomer(id: any, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${appConfig.apiUrl}/auth/update/${id}`, data, { headers });
  }
  updateB2b(id: any, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/updateB2b/${id}`, data, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  uploadToDrive(formData: any): Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/uploadToDrive`, formData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  // uploadToDrive(formData: any): Observable<any>{
  //   return this.http.post(`${appConfig.apiUrl}/auth/uploadToDrive`, formData);
  // }
  cancelUpload(uploadId: string): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/cancelUpload`, { uploadId });
  }

  updateCustomerbyEditor(id: any, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/updateEditor/${id}`, data, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  updateB2bbyEditor(id: any, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/updateB2bEditor/${id}`, data, { headers: this.httpHeaders }).pipe(
      catchError(this.handleError)
    )
  }

  getCustomer(id: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/read-cust/${id}`, { headers: this.httpHeaders }).pipe(map((res: any) => {
      return res || {}
    }), catchError(this.handleError)
    )
  }
  getB2b(id: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/read-b2b/${id}`, { headers: this.httpHeaders }).pipe(map((res: any) => {
      return res || {}
    }), catchError(this.handleError)
    )
  }

  updateEmployee(id: any, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/updateEmp/${id}`, data, { headers: this.httpHeaders }).pipe(catchError(this.handleError))
  }

  updatePayment(companyName: any, signupName: any, signupRole: any, videoType: any, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/updatePay/${companyName}/${signupName}/${signupRole}/${videoType}`, data);
  }

  getEmployee(id: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/read-emp/${id}`, { headers: this.httpHeaders }).pipe(map((res: any) => {
      return res || {}
    }), catchError(this.handleError)
    )
  }

  deleteEmp(id: any): Observable<any> {
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-emp/${id}`, { headers: this.httpHeaders }).pipe(catchError(this.handleError))
  }

  deleteCust(id: any): Observable<any> {
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-cust/${id}`, { headers: this.httpHeaders }).pipe(catchError(this.handleError))
  }
  deleteSalesLead(id: any): Observable<any> {
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-sales/${id}`, { headers: this.httpHeaders }).pipe(catchError(this.handleError))
  }
  deleteB2b(id: any): Observable<any> {
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-B2b/${id}`, { headers: this.httpHeaders }).pipe(catchError(this.handleError))
  }

  getCountries(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/countries`);
  }

  getStates(countryCode: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/states/${countryCode}`);
  }

  getCities(countryCode: any, stateCode: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/cities/${countryCode}/${stateCode}`);
  }

  getMonthEntries(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntries`);
  }

  getMonthEntriesEmp(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'const-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntriesEmp`, { headers });
  }
  getDueAmount(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntriesDue`);
  }
  getRestAmount(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntriesRest`);
  }
  getRestAmountDownloadAdmin() {
    this.http.get(`${appConfig.apiUrl}/auth/totalEntriesRestDownloadAdmin/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'restAmountCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }
  getDueAmountDownloadAdmin() {
    this.http.get(`${appConfig.apiUrl}/auth/totalEntriesDueDownloadAdmin/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'restAmountCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }

  getRestAmountDownload() {
    this.http.get(`${appConfig.apiUrl}/auth/totalEntriesRestDownload/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'restAmountCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }
  getDueAmountDownload() {
    this.http.get(`${appConfig.apiUrl}/auth/totalEntriesDueDownload/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'restAmountCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }
  getTodayEntryDownloadAdmin() {
    this.http.get(`${appConfig.apiUrl}/auth/todayEntriesDownloadAdmin/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'todayEntryCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }
  getTotalEntryDownloadAdmin() {
    this.http.get(`${appConfig.apiUrl}/auth/totalEntriesDownloadAdmin/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'totalEntryCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }
  getTotalOngoingDownloadAdmin() {
    this.http.get(`${appConfig.apiUrl}/auth/allOngoingProjectsDownloadAdmin/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'ActiveCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }
  getAllActiveDownloadAdmin() {
    this.http.get(`${appConfig.apiUrl}/auth/allActiveProjectsDownloadAdmin/`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'AllActiveCustomers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }
  getDueAmountAdmin(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntriesDueAdmin`);
  }
  getRestAmountAdmin(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntriesRestAdmin`);
  }

  getMonthEntriesB2b(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntriesB2b`);
  }
  getPreviousMonthEntriesB2b(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalPreviousEntriesB2b`);
  }
  getTwoPreviousMonthEntriesB2b(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/totalTwoPreviousEntriesB2b`);
  }
  getAllEntriesB2b(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/allTotalEntriesB2b`);
  }

  getTodayEntries(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntries`);
  }

  getTodayEntriesEmp(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'const-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesEmp`, { headers });
  }
  getTodayEntriesScript(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesScript`);
  }
  getTodayEntriesVo(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesVo`);
  }
  getTodayEntriesEditor(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesEditor`);
  }
  getTodayEntriesEditorOther(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesEditorOther`);
  }

  rangeTotalRecv(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/rangeTotalRecvAmount/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  rangeTopPerformer(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/rangeTopPerformer/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getOngoingRangeData(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/onGoingRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getDatabyRange(startDate: Date, endDate: Date): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'const-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${appConfig.apiUrl}/auth/dataByRange/${startDate.toISOString()}/${endDate.toISOString()}`, { headers });
  }
  getDatabyCampaign(startDate: Date, endDate: Date, campaign: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/DataByCampaign/${startDate.toISOString()}/${endDate.toISOString()}/${campaign}`);
  }
  getDataByClosingCamp(startDate: Date, endDate: Date, campaign: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByClosingCamp/${startDate.toISOString()}/${endDate.toISOString()}/${campaign}`);
  }
  getDatabyRangeB2b(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDateB2b/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getDatabyDatePassRange(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getDatabyDatePassRangeVo(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRangeVo/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getDatabyDatePassRangeEditor(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRangeEditor/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getPayrollbyDatePassRangeEditor(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/payrollByDatePassRangeEditor/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getPayrollbyDatePassRangeEditorAll(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/payrollByDatePassRangeEditorAll/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getPayrollbyDatePassRangeScript(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/payrollByDatePassRangeScript/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getPayrollbyDatePassRangeVo(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/payrollByDatePassRangeVo/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getDatabyDatePassRangeEditorOther(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRangeEditorOther/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getTmPay(startDate: Date, endDate: Date, tmName: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByTm/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`);
  }
  getTmPayB2b(startDate: Date, endDate: Date, tmName: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByTmB2b/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`);
  }
  getEditorDetails(startDate: Date, endDate: Date, tmName: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByEditorPayment/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`);
  }
  getEditorDetailsB2b(startDate: Date, endDate: Date, tmName: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByEditorPaymentB2b/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`);
  }
  getScriptDetails(startDate: Date, endDate: Date, tmName: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByScriptPayment/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`);
  }
  getVoDetails(startDate: Date, endDate: Date, tmName: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/dataByVoPayment/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`);
  }
  updatePayrollDetails(startDate: Date, endDate: Date, tmName: String, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/editorPayrollUpdate/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`, data);
  }
  updatePayrollDetailsB2b(startDate: Date, endDate: Date, tmName: String, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/editorPayrollUpdateB2b/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`, data);
  }
  updatePayrollDetailsScript(startDate: Date, endDate: Date, tmName: String, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/editorPayrollUpdateScript/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`, data);
  }
  updatePayrollDetailsVo(startDate: Date, endDate: Date, tmName: String, data: any): Observable<any> {
    return this.http.put(`${appConfig.apiUrl}/auth/editorPayrollUpdateVo/${startDate.toISOString()}/${endDate.toISOString()}/${tmName}`, data);
  }
  payrollData(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/editorPayroll`);
  }
  allPayrollData(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/allPayroll`);
  }
  payrollDataScript(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/scriptPayroll`);
  }
  payrollDataVo(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/voPayroll`);
  }

  getLeadbyRange(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/leadsByRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getInvoice(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getInvoice/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getSalesLeadbyRange(startDate: Date, endDate: Date, categ: String): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/salesleadsByRange/${startDate.toISOString()}/${endDate.toISOString()}/${categ}`);
  }
  getSalesLeadbyRangeSales(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/salesleadsByRangeSales/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getSalesLeadbyRangeAdmin(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/salesleadsByRangeAdmin/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${appConfig.apiUrl}/auth/uploadFile`, formData).toPromise();
  }

  downloadFile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    this.http.get(`${appConfig.apiUrl}/auth/downloadFile`, { headers, responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log('Download Complete')
    }, error => {
      console.error('Error Downloading File', error);
    });
  }

  downloadFileB2b() {
    this.http.get(`${appConfig.apiUrl}/auth/downloadFileB2b`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log('Download Complete')
    }, error => {
      console.error('Error Downloading File', error);
    });
  };

  downloadRangeFile(startDate: Date, endDate: Date) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    this.http.get(`${appConfig.apiUrl}/auth/downloadRangeFile/${startDate.toISOString()}/${endDate.toISOString()}`, { headers, responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }

  downloadCampaignLead(startDate: Date, endDate: Date, campaign: String) {
    this.http.get(`${appConfig.apiUrl}/auth/downloadCampaignLead/${startDate.toISOString()}/${endDate.toISOString()}/${campaign}`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'LeadsData.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }

  downloadCategoryCamp(startDate: Date, endDate: Date, campaign: String) {
    this.http.get(`${appConfig.apiUrl}/auth/downloadCategoryCamp/${startDate.toISOString()}/${endDate.toISOString()}/${campaign}`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'ClosingData.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File:', error);
    });
  }

  downloadRangeFileB2b(startDate: Date, endDate: Date) {
    this.http.get(`${appConfig.apiUrl}/auth/downloadRangeFileB2b/${startDate.toISOString()}/${endDate.toISOString()}`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }

  downloadSalesRangeFile(startDate: Date, endDate: Date) {
    this.http.get(`${appConfig.apiUrl}/auth/downloadSalesRangeFile/${startDate.toISOString()}/${endDate.toISOString()}`, { responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }

  downloadDueFile(startDate: Date, endDate: Date) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    this.http.get(`${appConfig.apiUrl}/auth/downloadDueFile/${startDate.toISOString()}/${endDate.toISOString()}`, { headers, responseType: 'blob' }).subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log("Download Done")
    }, error => {
      console.error('Error Downloading File: ', error);
    });
  }

  newCategory(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/newCategory`, data);
  }
  newWhatsAppCategory(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/newWhatsAppCategory`, data);
  }

  getCategory(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getCategory`);
  }
  getWhatsAppCategory(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getWhatsAppCategory`);
  }

  newSalesTeam(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/newSalesTeam`, data);
  }

  getSalesTeam(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesTeam`)
  }

  newfbToken(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/fbToken`, data);
  }
  getfbToken(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getFbToken`);
  }
  addCompany(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/addCompany`, data);
  }
  getCompany(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getCompany`);
  }
  getCompanyPay(id: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getCompanyPay/${id}`, { headers: this.httpHeaders }).pipe(map((res: any) => {
      return res || {}
    }), catchError(this.handleError))
  }

  deleteCompany(id: any): Observable<any> {
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-comp/${id}`, { headers: this.httpHeaders }).pipe(catchError(this.handleError))
  }

  getSalesLeads() {
    return this.http.get(`${appConfig.apiUrl}/auth/getSales-leads`);
  }

  getTeamLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getTeams-leads/${name}`);
  }
  getWhatsAppLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getWhatsApp-leads/${name}`);
  }

  assignCampaign(data: {campaignName: string, employees: string[]}):Observable<any>{
    return this.http.put(`${appConfig.apiUrl}/auth/assign-campaign`, data)
  }
  getAssignedCampaigns(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/get-assigned-campaigns`);
  }
  getCampaign(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getCampaignNames`);
  }
  getWhatsAppCampaign(): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getWhatsAppCampaignNames`);
  }
  getAllCampaign(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getAllCampaignNames`);
  }
  getClosing(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getClosingNames`);
  }
  allClosing(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/allClosing`);
  }
  getIncentive(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/allIncentive`);
  }

  getEmpSalesTeamWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getEmpSalesTeamWork/${name}`);
  }
  getEmpSalesYesterdayTeamWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getEmpSalesYesterdayTeamWork/${name}`);
  }
  getEmpSalesOneYesterdayTeamWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getEmpSalesOneYesterdayTeamWork/${name}`);
  }
  getEmpSalesTwoYesterdayTeamWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getEmpSalesTwoYesterdayTeamWork/${name}`);
  }
  getEmpSalesThreeYesterdayTeamWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getEmpSalesThreeYesterdayTeamWork/${name}`);
  }
  getEmpSalesFourYesterdayTeamWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getEmpSalesFourYesterdayTeamWork/${name}`);
  }
  getEmpSalesFiveYesterdayTeamWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getEmpSalesFiveYesterdayTeamWork/${name}`);
  }

  getSalesTeamWork(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesTeamWork`);
  }
  getSalesWhatsAppWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesWhatsAppWork/${name}`);
  }

  getYesterdayTeamLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getYesterdayTeams-leads/${name}`);
  }
  getYesterdayWhatsAppLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getYesterdayWhatsApp-leads/${name}`);
  }

  getSalesYesterdayTeamWork(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesYesterdayTeamWork`);
  }
  getSalesYesterdayWhatsAppWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesYesterdayWhatsAppWork/${name}`);
  }

  getOneYesterdayWhatsAppLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getOneYesterdayWhatsApp-leads/${name}`);
  }
  getOneYesterdayTeamLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getOneYesterdayTeams-leads/${name}`);
  }

  getSalesOneYesterdayTeamWork(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesOneYesterdayTeamWork`);
  }
  getSalesOneYesterdayWhatsAppWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesOneYesterdayWhatsAppWork/${name}`);
  }

  getTwoYesterdayTeamLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getTwoYesterdayTeams-leads/${name}`);
  }
  getTwoYesterdayWhatsAppLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getTwoYesterdayWhatsApp-leads/${name}`);
  }

  getSalesTwoYesterdayTeamWork(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesTwoYesterdayTeamWork`);
  }
  getSalesTwoYesterdayWhatsAppWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesTwoYesterdayWhatsAppWork/${name}`);
  }

  getThreeYesterdayTeamLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getThreeYesterdayTeams-leads/${name}`);
  }
  getThreeYesterdayWhatsAppLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getThreeYesterdayWhatsApp-leads/${name}`);
  }

  getSalesThreeYesterdayTeamWork(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesThreeYesterdayTeamWork`);
  }
  getSalesThreeYesterdayWhatsAppWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesThreeYesterdayWhatsAppWork/${name}`);
  }

  getFourYesterdayTeamLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getFourYesterdayTeams-leads/${name}`);
  }
  getFourYesterdayWhatsAppLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getFourYesterdayWhatsApp-leads/${name}`);
  }

  getSalesFourYesterdayTeamWork(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFourYesterdayTeamWork`);
  }
  getSalesFourYesterdayWhatsAppWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFourYesterdayWhatsAppWork/${name}`);
  }

  getFiveYesterdayTeamLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getFiveYesterdayTeams-leads/${name}`);
  }
  getFiveYesterdayWhatsAppLeads(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getFiveYesterdayWhatsApp-leads/${name}`);
  }

  getSalesFiveYesterdayTeamWork(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFiveYesterdayTeamWork`);
  }
  getSalesFiveYesterdayWhatsAppWork(name: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFiveYesterdayWhatsAppWork/${name}`);
  }

  transferLeads(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/transferLeads`);
  }

  getAdminLeads() {
    return this.http.get(`${appConfig.apiUrl}/auth/getAdmin-leads`);
  }

  scriptProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/scriptProjects`);
  }

  scriptPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/scriptPreviousProjects`)
  }
  scriptTwoPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/scriptTwoPreviousProjects`)
  }
  allscriptProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allScriptProjects`)
  }

  editorProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorProjects`);
  }
  bundleProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/bundleProjects`);
  }

  editorPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorPreviousProjects`)
  }
  editorTwoPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorTwoPreviousProjects`)
  }
  bundlePreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/bundlePreviousProjects`)
  }
  bundleTwoPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/bundleTwoPreviousProjects`)
  }
  allEditorProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allEditorProjects`)
  }
  allBundleProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allBundleProjects`)
  }

  editorOtherProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorProjectsOther`);
  }
  editorPreviousOtherProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorPreviousOtherProjects`)
  }
  editorTwoPreviousOtherProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/editorTwoPreviousOtherProjects`)
  }
  allEditorOtherProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allEditorOtherProjects`)
  }

  voProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/voProjects`);
  }
  voPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/voPreviousProjects`)
  }
  voTwoPreviousProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/voTwoPreviousProjects`)
  }
  allVoProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allVoProjects`)
  }

  quotes(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/quotes`);
  }

  updateLead(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/updateSalesTeam`);
  }

  estInvoiceCount(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/estInvoiceCount`);
  }
  // mainInvoiceCount(): Observable<any> {
  //   return this.http.get(`${appConfig.apiUrl}/auth/mainInvoiceCount`);
  // }
  mainInvoiceCount(financialYear: string) {
  return this.http.get(`${appConfig.apiUrl}/auth/mainInvoiceCount?clientFY=${financialYear}`);
}


  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getPreviousMonthName(): string {
    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[previousMonth.getMonth()];
  }
  getPreviousTwoMonthName(): string {
    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[previousMonth.getMonth()];
  }
  getCurrentMonthName(): string {
    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[previousMonth.getMonth()];
  }

  getDate(offset: number = 0): string {
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    return date.toDateString();
  }

  getAccessToken(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getAccessToken`);
  };

  saveToken(token1: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${appConfig.apiUrl}/auth/save-Token/${token1}`, {}, { headers }).pipe(
      catchError((error) => {
        console.error('HTTP error occurred:', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }

  sendNotification(data: any, msgTitle: any, msgBody: any, currentDate: any): Observable<any> {
    const body = {
      items: data,
      msgTitle: msgTitle,
      msgBody: msgBody,
      currentDate: currentDate,
      // sales: sales
    };
    return this.http.post(`${appConfig.apiUrl}/auth/bell`, body);
  }

  sendNotifications(data: any, sales: any, msgTitle: any, msgBody: any, currentDate: any): Observable<any> {
    const body = {
      items: data,
      sales: sales,
      msgTitle: msgTitle,
      msgBody: msgBody,
      currentDate: currentDate
    };
    return this.http.post(`${appConfig.apiUrl}/auth/bells`, body);
  }

  sendNotificationsAdmin(data: any, sales: any, msgTitle: any, msgBody: any, currentDate: any): Observable<any> {
    const body = {
      items: data,
      sales: sales,
      msgTitle: msgTitle,
      msgBody: msgBody,
      currentDate: currentDate
    };
    return this.http.post(`${appConfig.apiUrl}/auth/bellsAdmin`, body);
  }

  getNotif(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${appConfig.apiUrl}/auth/getNotification`, { headers });
  }

  markRead(notifId: { id: string }): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/markRead`, notifId);
  }

  topPerformer(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/topPerformer`);
  }
  monthlyPerformer(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/monthlyPerformer`);
  }
  topCategory(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/topProduct`);
  }
  conversionRate(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/conversionRate`);
  }
  conversionRateMonthly(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/conversionRateMonthly`);
  }
  getAttendance(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${appConfig.apiUrl}/auth/attendance1?year=${year}&month=${month}`);
  }
  // saveAttendance(year: number, month: number, attendanceData: any): Observable<any> {
  //   return this.http.post<any>(`${appConfig.apiUrl}/auth/update-attendance`, { year, month, attendanceData });
  // }

  getAttendance1(year: number, month: number): Observable<{ success: boolean; data: AttendanceData[] }> {
    return this.http.get<{ success: boolean; data: AttendanceData[] }>(`${appConfig.apiUrl}/auth/attendance?year=${year}&month=${month}`);
  }

  // Update attendance status for a specific user, year, and month
  updateAttendance(username: string, year: number, month: number, attendance: AttendanceEntry[]): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${appConfig.apiUrl}/auth/update-attendance`, {
      username,
      year,
      month,
      attendance
    });
  }

  newSubsidiary(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/newSubsidiary`, data);
  }

  getSubsidiary(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/getSubsidiary`);
  }

  urgentScriptProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/urgentScriptProjects`);
  }
  highScriptProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/highScriptProjects`);
  }
  mediumScriptProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/mediumScriptProjects`);
  }

  urgentEditorProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/urgentEditorProjects`);
  }
  highEditorProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/highEditorProjects`);
  }
  mediumEditorProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/mediumEditorProjects`);
  }
  changesEditorProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/changesEditorProjects`);
  }

  urgentVoProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/urgentVoProjects`);
  }
  highVoProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/highVoProjects`);
  }
  mediumVoProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/mediumVoProjects`);
  }

  urgentGraphicProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/urgentGraphicProjects`);
  }
  pendingGraphicProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/pendingGraphicProjects`);
  }
  todayGraphicProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/todayGraphicProjects`);
  }
  changesGraphicProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/changesGraphicProjects`);
  }

  todayAssignedTask() {
    return this.http.get(`${appConfig.apiUrl}/auth/todayAssignedTask`);
  }
  pendingAssignedTask() {
    return this.http.get(`${appConfig.apiUrl}/auth/pendingAssignedTask`);
  }

  getTodayEntriesGraphics(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesGraphic`);
  }
  getGraphicData() {
    return this.http.get(`${appConfig.apiUrl}/auth/graphicActiveList`);
  }
  getCompleteGraphicData() {
    return this.http.get(`${appConfig.apiUrl}/auth/graphicCompleteList`);
  }
  allGraphicProjects() {
    return this.http.get(`${appConfig.apiUrl}/auth/allGraphicProjects`);
  }

  tasksDataLength() {
    return this.http.get(`${appConfig.apiUrl}/auth/taskDataLength`);
  }
  addTask(taskData: any) {
    return this.http.post(`${appConfig.apiUrl}/auth/addTask`, taskData);
  }
  addIncentive(incentiveData: any) {
    return this.http.put(`${appConfig.apiUrl}/auth/addIncentive`, incentiveData);
  }
  addPoint(pointData: any) {
    return this.http.put(`${appConfig.apiUrl}/auth/addPoint`, pointData);
  }
  getPoint(){
    return this.http.get(`${appConfig.apiUrl}/auth/getPoints`);
  }
  getPointsByVideoType(videoType: string) {
  return this.http.get(`${appConfig.apiUrl}/auth/getPoint/${videoType}`);
}

  updateEditorMonthlyPoints(editorName: string) {
    return this.http.post<any>(`${appConfig.apiUrl}/auth/update-editor-monthly-points`, { editorName });
  }
  getAllEditorMonthlyPoints() {
  return this.http.get<any>(`${appConfig.apiUrl}/auth/all-editor-monthly-points`);
  }

  transferToLeads(user: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/transferNewLeads`, user);
  }
  transferCustomertoSales(user: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/transferCustomerToSalesLead`, user);
  }
  getUserAttendance(year: number, month: number): Observable<{ success: boolean; data: AttendanceData[] }> {
    return this.http.get<{ success: boolean; data: AttendanceData[] }>(`${appConfig.apiUrl}/auth/usersAttendance?year=${year}&month=${month}`);
  }
  allEmpIncentive(year: number, month: number): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/categoryAmount?year=${year}&month=${month}`);
  }
  salesIncentive(pass: any, year: number, month: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application.json',
      'Authorization': `Bearer ${token}`
    });
    const params = new HttpParams().set('pass', pass);
    return this.http.get(`${appConfig.apiUrl}/auth/salesIncentive?year=${year}&month=${month}`, { headers, params });
  }
  todayAmount(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/todayAmount`);
  }
  receivedQr(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/receivedQr`);
  }
  getSelectedInvoice(id: any): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/read-inv/${id}`, { headers: this.httpHeaders }).pipe(map((res: any) => {
      return res || {}
    }), catchError(this.handleError))
  }

  getSalesData(): Observable<any> {
    return this.http.get(`${appConfig.apiUrl}/auth/sales-data`);
  }

  impersonateUser(userId: string): Observable<any> {
    return this.http.post<any>(`${appConfig.apiUrl}/auth/impersonate`, { userId });
  }

  uploadLead(formData:FormData):Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${appConfig.apiUrl}/auth/uploadLead`,formData,{headers});
  }

  dateCamapign(selectDate:string, name: string):Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getDateCampaign/${name}`,{
      params: {
        selectDate
      }
    });
  }
  getSalesLeadbyFilter(filters: any):Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/filter`, filters);
  }
  allSalesLead():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/allSalesLeads`);
  }
  transferLeadtoSalesPerson(transferData:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/transferLeadtoSalesPerson`, transferData);
  }

  // dateWhatsAppCampaign(selectDate:string, name:string):Observable<any>{
  //   return this.http.get(`${appConfig.apiUrl}/auth/getDateWhatsAppCampaign/${name}`,{
  //     params:{
  //       selectDate
  //     }
  //   });
  // }
}