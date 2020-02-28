import { Component, OnInit ,Input} from '@angular/core';

import { UserService } from '../../shared/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { TeacherprofileComponent } from '../teacherprofile.component'
// let student=require('../teacherprofile.component/userDetails');

@Component({
  selector: 'app-practical-incharge',
  templateUrl: './practical-incharge.component.html',
  styleUrls: ['./practical-incharge.component.css']
})
export class PracticalInchargeComponent implements OnInit {
  teacher=this.userService.getData();
  constructor(private userService: UserService,private http: HttpClient) { }

  ngOnInit() {
    console.log(this.teacher.teacher_id,'hello');
    var role=this.teacher.Role.split(',');
    var batch=this.teacher.Batch.split(',');
    var division=this.teacher.Division.split(',');
    var year=this.teacher.Year.split(',');
    
  }

  uploadedFiles: Array < File > ;


  fileChange(element) {
    this.uploadedFiles = element.target.files;
}

upload() {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("file", this.uploadedFiles[i]);
    }
    return this.http.post(environment.apiBaseUrl+'/upload', formData)
        .subscribe((response) => {
            console.log('response received is ', response);
        })
}

  

}
