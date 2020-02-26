import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
declare var require: any
var $ = require('jquery');
// import $ from 'jquery';
// window.jQuery = window.$ = $;

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.css']
})
export class StudentprofileComponent implements OnInit {

  userDetails;
  timetable;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getstudentProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        this.timetable=res['time'];
        console.log(this.userDetails);
        console.log(this.timetable);
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

  check(){
    console.log('js working');
  }

  model={
    language:"",
    code:"",
    input:"",
    output:"",
    error:"",
    message:"",
    description:""
  }
  codesubmit(form:NgForm){
    console.log('in function');
    var x,y,token,timer = '';
    var lang = 'C';
    var code ='';
    var my_input='';
    var gfg_compiler_api_endpoint = "https://api.judge0.com/submissions/";
    var languages = ['C', 'Cpp', 'Cpp14', 'Java', 'Python', 'Python3', 'Scala', 'Php', 'Perl', 'Csharp'];
    lang=$("#lang").val();
    // alert(lang);
    code=$("#code").val();
    my_input=$("#input").val();
    x = $.post(gfg_compiler_api_endpoint+'?base64_encoded=false&wait=true/' ,{'language_id': lang,'source_code': code,'stdin': my_input } ).done(function(data) {
      token = data['token']+'/'
       let timer = setInterval(function(){
                  y = $.get(gfg_compiler_api_endpoint + token).done(function(op){
                    if (op['status']['id']!=1 && op['status']['id']!=2){
                      clearInterval(timer);
                      // console.log(op['stdout']);
                      this.output=op['stdout'];
                      console.log(this.output);
                      $("#output").val(op['stdout']);
                      $("#error").val(op['stderr']);
                      $("#message").val(op['message']);
                      $("#description").val(op['status']['description']);
                    }
                  }).fail(function(){
                    alert("error1");
                  });
                }, 1000)
      }).fail(function() {
          alert( "error2" );
        });
    console.log(form.value);
  }

}
