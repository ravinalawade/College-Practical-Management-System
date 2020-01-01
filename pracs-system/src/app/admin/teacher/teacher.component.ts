import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserService } from '../../shared/user.service';
import { environment } from './../../../environments/environment'

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  // constructor() { }

  ngOnInit() {
  }

  
  
  uploadedFiles: Array < File > ;

  constructor(private http: HttpClient) {
      
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
}

upload() {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("file", this.uploadedFiles[i]);
    }
    return this.http.post(environment.apiBaseUrl+'/uploadexcel', formData)
        .subscribe((response) => {
            console.log('response received is ', response);
        })
}

}
