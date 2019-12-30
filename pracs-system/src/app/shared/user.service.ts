import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  selectedUser: User = {
    username: '',
    password: '',
  }

  constructor( private http: HttpClient ) { }

  postUser(user: User){
    this.http.post(environment.apiBaseURL+'/student_register', user);
    this.http.post(environment.apiBaseURL+'/teacher_register', user);
  }
}
