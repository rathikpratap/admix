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

  allEmployee(){
    return this.http.get(`${appConfig.apiUrl}/auth/allEmployee`);
  }

  searchCustomerbyMobile(mobile:string): Observable<any>{
    return this.http.get<any>(`${appConfig.apiUrl}/auth/searchCustomer/${mobile}`);
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
