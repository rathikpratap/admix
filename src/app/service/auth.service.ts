import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { appConfig } from 'src/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpHeaders= new HttpHeaders().set('Content-Type','application/json')

  constructor(private http:HttpClient, private router: Router) { }

  signup(data:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/register`, data);
  }

  //  signin(loginData:any):Observable<any>{
  //    return this.http.post(`${appConfig.apiUrl}/auth/login`, loginData);
  //  }

   signin(credentials: {loginUsername: string, loginPswd: string}):Observable<any>{
     return this.http.post(`${appConfig.apiUrl}/auth/login`, credentials);
   }
 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  addcustomer(customerData:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/customer`, customerData)
  }

  getCustData(){
    return this.http.get(`${appConfig.apiUrl}/auth/list`);
  }
  getScriptData(){
    return this.http.get(`${appConfig.apiUrl}/auth/scriptActiveList`);
  }
  getVoData(){
    return this.http.get(`${appConfig.apiUrl}/auth/voActiveList`);
  }
  getEditorData(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorActiveList`);
  }
  getCompleteScriptData(){
    return this.http.get(`${appConfig.apiUrl}/auth/scriptCompleteList`);
  }

  getEditorOtherData(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorOtherActiveList`);
  }
  getCompleteEditorOtherData(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorOtherCompleteList`);
  }
  getCompleteVoData(){
    return this.http.get(`${appConfig.apiUrl}/auth/voCompleteList`);
  }
  getCompleteEditorData(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorCompleteList`);
  }
  allProjectsSales(){
    return this.http.get(`${appConfig.apiUrl}/auth/allList`);
  } 
  allProjectsAdmin(){
    return this.http.get(`${appConfig.apiUrl}/auth/allListAdmin`);
  } 

  getLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/getFacebook-leads`);  
  }
  fetchLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/facebook-leads`);
  }

  salesFacebookLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/salesFacebook-leads`);
  }

  getSalesFacebookLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFacebook-leads`);
  }

  updateSalesperson(data: any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/update-salespersons`,{items: data});
  }

  updateProjectStatus(data: any): Observable<any> {
    return this.http.post(`${appConfig.apiUrl}/auth/update-projectStatus`,{items: data});
  }

  updateEditors(data: any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/updateEditor`,{items: data});
  }

  getCompleteProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/completeProject`);
  }

  getAllProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allOngoingProjects`);
  }

  getAllCompleteProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allCompleteProjects`);
  }

  salesAllProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allProjects`);
  }

  salesPreviousMonthProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allPreviousProjects`);
  }
  salesPreviousTwoMonthProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allTwoPreviousProjects`);
  }

  allProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allProjectsAdmin`);
  }
  allPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allPreviousProjectsAdmin`);
  }
  allTwoPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allTwoPreviousProjectsAdmin`);
  }
  monthRestAmount(){
    return this.http.get(`${appConfig.apiUrl}/auth/totalRecvAmount`);
  }

  dataLength(){
    return this.http.get(`${appConfig.apiUrl}/auth/dataLength`);
  }

  allEmployee(){
    return this.http.get(`${appConfig.apiUrl}/auth/allEmployee`);
  }

  searchCustomerbyMobile(mobile:string): Observable<any>{
    return this.http.get<any>(`${appConfig.apiUrl}/auth/searchCustomer/${mobile}`);
  }

  searchCustomerbyProject(projectStatus:string): Observable<any>{
    return this.http.get<any>(`${appConfig.apiUrl}/auth/customerProject/${projectStatus}`);
  }

  searchCustomerbyProjectName(projectName:string):Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/customerProjectName/${projectName}`);
  }

  getProfile(){
    let headers = {
      'Authorization': "Bearer " + localStorage.getItem('token')
    }
    return this.http.get(`${appConfig.apiUrl}/auth/profile`, {headers:headers})
  }

  updateCustomer(id:any, data:any):Observable<any>{
    return this.http.put(`${appConfig.apiUrl}/auth/update/${id}`, data, {headers:this.httpHeaders}).pipe(
      catchError(this.handleError)
    )
  }

  updateCustomerbyEditor(id:any, data:any):Observable<any>{
    return this.http.put(`${appConfig.apiUrl}/auth/updateEditor/${id}`, data, {headers:this.httpHeaders}).pipe(
      catchError(this.handleError)
    )
  }

  getCustomer(id:any) :Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/read-cust/${id}`,{headers:this.httpHeaders}).pipe(map((res:any)=>{
      return res || {}
    }), catchError(this.handleError)
  )}

  updateEmployee(id:any, data:any):Observable<any>{
    return this.http.put(`${appConfig.apiUrl}/auth/updateEmp/${id}`, data, {headers:this.httpHeaders}).pipe( catchError(this.handleError))
  }

  updatePayment(companyName:any, signupName:any, data:any):Observable<any>{
    return this.http.put(`${appConfig.apiUrl}/auth/updatePay/${companyName}/${signupName}`,data);
  }

  getEmployee(id:any):Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/read-emp/${id}`, {headers:this.httpHeaders}).pipe(map((res:any)=>{
      return res || {}
    }), catchError(this.handleError)
  )}

  deleteEmp(id:any):Observable<any>{
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-emp/${id}`, {headers:this.httpHeaders}).pipe( catchError(this.handleError))
  }

  deleteCust(id:any):Observable<any>{
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-cust/${id}`, {headers: this.httpHeaders}).pipe( catchError(this.handleError))
  }

  getCountries(): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/countries`);
  }

  getStates(countryCode: any): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/states/${countryCode}`);
  }

  getCities(countryCode:any, stateCode: any): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/cities/${countryCode}/${stateCode}`);
  }

  getMonthEntries(): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntries`);
  }

  getMonthEntriesEmp(): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/totalEntriesEmp`);
  }

  getTodayEntries(): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntries`);
  } 

  getTodayEntriesEmp(): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesEmp`);
  }
  getTodayEntriesScript():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesScript`);
  }
  getTodayEntriesVo():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesVo`);
  }
  getTodayEntriesEditor():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesEditor`);
  }
  getTodayEntriesEditorOther():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/todayEntriesEditorOther`);
  }

  getDatabyRange(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/dataByRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getDatabyDatePassRange(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getDatabyDatePassRangeVo(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRangeVo/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getDatabyDatePassRangeEditor(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRangeEditor/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getDatabyDatePassRangeEditorOther(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/dataByDatePassRangeEditorOther/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getLeadbyRange(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/leadsByRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getSalesLeadbyRange(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/salesleadsByRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }
  getSalesLeadbyRangeAdmin(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/salesleadsByRangeAdmin/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  uploadFile(file: File): Promise<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${appConfig.apiUrl}/auth/uploadFile`, formData).toPromise();
  } 

  downloadFile(){
    this.http.get(`${appConfig.apiUrl}/auth/downloadFile`,{responseType: 'blob'}).subscribe((res: any)=>{
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log('Download Complete')
    }, error => {
      console.error('Error Downloading File', error);
    });
  }

  downloadRangeFile(startDate: Date, endDate: Date){
    this.http.get(`${appConfig.apiUrl}/auth/downloadRangeFile/${startDate.toISOString()}/${endDate.toISOString()}`, {responseType: 'blob'}).subscribe((res: any)=>{
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log("Download Done")
    }, error =>{
      console.error('Error Downloading File: ',error);
    });
  }

  downloadSalesRangeFile(startDate: Date, endDate: Date){
    this.http.get(`${appConfig.apiUrl}/auth/downloadSalesRangeFile/${startDate.toISOString()}/${endDate.toISOString()}`, {responseType: 'blob'}).subscribe((res: any)=>{
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log("Download Done")
    }, error =>{
      console.error('Error Downloading File: ',error);
    });
  }

  downloadDueFile(startDate: Date, endDate: Date){
    this.http.get(`${appConfig.apiUrl}/auth/downloadDueFile/${startDate.toISOString()}/${endDate.toISOString()}`, {responseType: 'blob'}).subscribe((res: any)=>{
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'customers.xlsx';
      link.click();
      console.log("Download Done")
    }, error =>{
      console.error('Error Downloading File: ',error);
    }); 
  }

  newCategory(data:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/newCategory`, data);
  }
  
  getCategory():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getCategory`);
  }

  newSalesTeam(data:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/newSalesTeam`, data);
  }

  getSalesTeam():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesTeam`)
  }

  newfbToken(data:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/fbToken`, data);
  }
  getfbToken():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getFbToken`);
  }
  addCompany(data:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/addCompany`, data);
  }
  getCompany():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getCompany`);
  }
  getCompanyPay(id:any):Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getCompanyPay/${id}`, {headers:this.httpHeaders}).pipe(map((res:any)=>{
      return res || {}
    }), catchError(this.handleError))
  }

  deleteCompany(id:any):Observable<any>{
    return this.http.delete(`${appConfig.apiUrl}/auth/delete-comp/${id}`, {headers: this.httpHeaders}).pipe( catchError(this.handleError))
  }

  getSalesLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/getSales-leads`);
  }

  getTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getTeams-leads`);
  }

  getSalesTeamWork():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesTeamWork`);
  }

  getYesterdayTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getYesterdayTeams-leads`);
  }

  getSalesYesterdayTeamWork():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesYesterdayTeamWork`);
  }

  getOneYesterdayTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getOneYesterdayTeams-leads`);
  }

  getSalesOneYesterdayTeamWork():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesOneYesterdayTeamWork`);
  }

  getTwoYesterdayTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getTwoYesterdayTeams-leads`);
  }

  getSalesTwoYesterdayTeamWork():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesTwoYesterdayTeamWork`);
  }

  getThreeYesterdayTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getThreeYesterdayTeams-leads`);
  }

  getSalesThreeYesterdayTeamWork():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesThreeYesterdayTeamWork`);
  }

  getFourYesterdayTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getFourYesterdayTeams-leads`);
  }

  getSalesFourYesterdayTeamWork():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFourYesterdayTeamWork`);
  }

  getFiveYesterdayTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getFiveYesterdayTeams-leads`);
  }

  getSalesFiveYesterdayTeamWork():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getSalesFiveYesterdayTeamWork`);
  }

  transferLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/transferLeads`);
  }

  getAdminLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/getAdmin-leads`);
  }

  scriptProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/scriptProjects`);
  }
  scriptPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/scriptPreviousProjects`)
  }
  scriptTwoPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/scriptTwoPreviousProjects`)
  }
  allscriptProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allScriptProjects`)
  }
  

  editorProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorProjects`);
  }

  editorPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorPreviousProjects`)
  }
  editorTwoPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorTwoPreviousProjects`)
  }
  allEditorProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allEditorProjects`)
  }


  editorOtherProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorProjectsOther`);
  }
  editorPreviousOtherProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorPreviousOtherProjects`)
  }
  editorTwoPreviousOtherProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/editorTwoPreviousOtherProjects`)
  }
  allEditorOtherProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allEditorOtherProjects`)
  }

  voProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/voProjects`);
  }
  voPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/voPreviousProjects`)
  }
  voTwoPreviousProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/voTwoPreviousProjects`)
  }
  allVoProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allVoProjects`)
  }

  quotes():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/quotes`);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent){
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getPreviousMonthName(): string{
    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[previousMonth.getMonth()];
  }
  getPreviousTwoMonthName(): string{
    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[previousMonth.getMonth()];
  }
  getCurrentMonthName(): string{
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
}
