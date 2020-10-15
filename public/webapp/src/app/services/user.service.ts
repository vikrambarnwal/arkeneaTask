import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:4000/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList(): Observable<any> {
    return this.http.get(API + 'users/', httpOptions);
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(API + 'users/' + id, httpOptions);
  }

  getUserDetails(id: String): Observable<any> {
    return this.http.get(API + 'users/' + id, httpOptions);
  }

  updateUser(id,userData): Observable<any> {
    return this.http.put(API + 'users/' + id, userData);
  }

  saveUser(userData): Observable<any> {
    let option={
      headers: new HttpHeaders({
      })
    };
    return this.http.post(API + 'users/add', userData,option);
  }
}
