import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpHeaders= new HttpHeaders().set('Content-Type','application/json')

  constructor(private http:HttpClient) { }

  signup(data:any):Observable<any>{
    return this.http.post('http://localhost:5000/auth/register', data);
  }

  signin(loginData:any):Observable<any>{
    return this.http.post('http://localhost:5000/auth/login', loginData);
  }

  addcustomer(customerData:any):Observable<any>{
    return this.http.post('http://localhost:5000/auth/customer', customerData)
  }

  getCustData(){
    return this.http.get('http://localhost:5000/auth/list');
  }

  getCompleteProjects(){
    return this.http.get('http://localhost:5000/auth/completeProject');
  }

  getAllProjects(){
    return this.http.get('http://localhost:5000/auth/allOngoingProjects');
  }

  getAllCompleteProjects(){
    return this.http.get('http://localhost:5000/auth/allCompleteProjects');
  }

    getProfile(){
    let headers = {
      'Authorization': "Bearer " + localStorage.getItem('token')
    }
    return this.http.get('http://localhost:5000/auth/profile', {headers:headers})
  }

  updateCustomer(id:any, data:any):Observable<any>{
    return this.http.put(`http://localhost:5000/auth/update/${id}`, data, {headers:this.httpHeaders}).pipe(
      catchError(this.handleError)
    )
  }

  getCustomer(id:any) :Observable<any>{
    return this.http.get(`http://localhost:5000/auth/read-cust/${id}`,{headers:this.httpHeaders}).pipe(map((res:any)=>{
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
