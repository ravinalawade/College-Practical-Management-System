import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-teacherprofile',
  templateUrl: './teacherprofile.component.html',
  styleUrls: ['./teacherprofile.component.css']
})
export class TeacherprofileComponent implements OnInit {

  userDetails;
  roles;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getteacherProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        this.roles=this.userDetails.Role.split(',');
        console.log(this.userDetails.teacher_id);
      },
      err => { 
        console.log(err);
        
      }
    );
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
