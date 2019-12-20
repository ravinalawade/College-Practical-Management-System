import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    Id: '',
    Password: '',
    Ren_Password: ''
  };
  
  constructor(private http: HttpClient) { }

  postUser(user: User){
    console.log(user);
    return this.http.post(environment.apiBaseUrl+'/gen_pass',user);
  }
}
