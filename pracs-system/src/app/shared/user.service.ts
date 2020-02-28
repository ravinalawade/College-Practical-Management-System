import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    Id: '',
    Password: '',
    Ren_Password: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  
  constructor(private http: HttpClient,private router:Router) { }

  //http methods
  postUser(user: User){
    console.log(user);
    return this.http.post(environment.apiBaseUrl+'/gen_pass',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials,this.noAuthHeader);
  }

  // uploadexcel(user:User){
  //   return this.http.post(environment.apiBaseUrl + '/uploadexcel',user);
  // }

  getstudentProfile() {
    return this.http.get(environment.apiBaseUrl + '/studentProfile');
  }

  getteacherProfile() {
    return this.http.get(environment.apiBaseUrl + '/teacherProfile');
  }

  //Helper Methods
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

  
  private data;

  setData(data){
    this.data = data;
  }

  getData(){
    let temp = this.data;
    this.clearData();
    return temp;
  }

  clearData(){
    this.data = undefined;
  }
}
