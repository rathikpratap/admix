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
