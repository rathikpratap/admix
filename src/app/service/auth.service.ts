import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { appConfig } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpHeaders= new HttpHeaders().set('Content-Type','application/json')

  constructor(private http:HttpClient) { }

  signup(data:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/register`, data);
  }

  signin(loginData:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/login`, loginData);
  }

  addcustomer(customerData:any):Observable<any>{
    return this.http.post(`${appConfig.apiUrl}/auth/customer`, customerData)
  }

  getCustData(){
    return this.http.get(`${appConfig.apiUrl}/auth/list`);
  } 

  getLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/getFacebook-leads`);
  }
  fetchLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/facebook-leads`);
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

  allProjects(){
    return this.http.get(`${appConfig.apiUrl}/auth/allProjectsAdmin`);
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

  getDatabyRange(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/dataByRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getLeadbyRange(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/leadsByRange/${startDate.toISOString()}/${endDate.toISOString()}`);
  }

  getSalesLeadbyRange(startDate: Date, endDate: Date): Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/salesleadsByRange/${startDate.toISOString()}/${endDate.toISOString()}`);
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

  getSalesLeads(){
    return this.http.get(`${appConfig.apiUrl}/auth/getSales-leads`);
  }

  getTeamLeads():Observable<any>{
    return this.http.get(`${appConfig.apiUrl}/auth/getTeams-leads`);
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

}
