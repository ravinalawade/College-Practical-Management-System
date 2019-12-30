import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';


import { UserService } from './../shared/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [UserService]
})
export class SignupComponent implements OnInit {
  showSucessMessage: boolean;
  serverErrorMessages: string;

  constructor(
    private route: ActivatedRoute,private userService:UserService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.userService.postUser(form.value).subscribe(
      // data=>console.log(data),
      res => {
        this.showSucessMessage = true;
        console.log(this.showSucessMessage);
        console.log(res);
        // setTimeout(() => this.showSucessMessage = false, 400);
        this.resetForm(form);
      },
      err => {
        console.log(err);
        if (err.status === 422) {
          console.log(this.serverErrorMessages);
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else{
          console.log(this.serverErrorMessages);
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
        }
      }
    );
  }

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      Id: '',
      Password: '',
      Ren_Password: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

}
