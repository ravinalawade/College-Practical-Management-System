import { Component, OnInit ,Input} from '@angular/core';

import { UserService } from '../../shared/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { TeacherprofileComponent } from '../teacherprofile.component'
// let student=require('../teacherprofile.component/userDetails');

var $ = require('jquery');
declare var require: any

@Component({
  selector: 'app-practical-incharge',
  templateUrl: './practical-incharge.component.html',
  styleUrls: ['./practical-incharge.component.css']
})
export class PracticalInchargeComponent implements OnInit {
  students;
  sub
  qn=0
  q=[];
  batches=[];
  teacher=this.userService.getData('role');
  flag=0
  totalexp=0
  com=[]
  constructor(private userService: UserService,private http: HttpClient) { }

  ngOnInit() {
    console.log(this.teacher);
    this.getbatch(this.teacher)
    // console.log(batch)
    // this.getstudents(batch)
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
    alert("Expermiment uploaded");
}

getbatch(data){
  for(var i in data)
  {
    if(data[i]['Role']=='practical_incharge')
    {
      var s
      s=data[i]['Year']+' '+data[i]['Division']+' '+data[i]['Batch']+' '+data[i]['Subject_Name']
      this.batches.push(s)
    }
  }
}

selectbatch(batch){
  console.log(batch.target.value)
  var batch=batch.target.value
  var temp=[]
  temp=batch.split(' ')
  this.sub=temp[3]
  this.total()
  this.userService.setData('subject',temp[3])
  var data={'Year':temp[0],'Division':temp[1],'Batch':temp[2]}
  this.getstudents(data)
}

getstudents(data){
  var year=data['Year']
  var div=data['Division']
  var batch=data['Batch']
  this.userService.students(year,div,batch).subscribe(
    res=>{
      console.log(res,'hello')
      this.students=res['students']
      for(var i in this.students)
      {
        var s=this.students[i]['student_id']
        var d={'student_id':s,'Subject_Name':this.sub}
        this.userService.complete(d).subscribe(
          res=>{
            console.log(res)
            this.com.push(res['comp'])
          },
          err=>{
            console.log(err)
          }
        )
      }
    },
    err=>{
      console.log(err)
    }
  )

}

save(j){
  this.userService.setData('student',this.students[j])
}

slide(){
  // $(document).ready(function(){
    // $("#btn").click(function(){
      if(this.flag==1){
      $("#d").slideUp();
      this.flag=0
      return
      }
      if(this.flag==0){
      $("#d").slideDown();
      this.flag=1
      return
      }
    // });
  }

  inc(){
    this.qn+=1
    $('#question').append("<input id="+this.qn+" placeholder='question'>")
  }

  uploadexp(){
    console.log($('#Exp_Name').val())
    var e=$('#Exp_Name').val();
    var s=$('#Subject_Name').val();
    var d=$('#Submission_date').val()
    for(var i=1;i<=this.qn;i++)
    {
      // console.log($('#'+i).val())
      this.q.push($('#'+i).val())
    }
    var data={'Exp_Name':e,'Subject_Name':s,'Question':this.q,'Submission_date':d}
    this.userService.setexperiment(data).subscribe(
      res=>{
        console.log(res)
      },
      err=>{
        console.log(err)
      }
    )
    alert("Experiment questions uploaded");
  }


  total(){
    // this.exp=[]
    this.userService.experiments(this.sub).subscribe(
      res=>{
        var e=res['exp']
        console.log(res['exp'].length)
        this.totalexp=res['exp'].length
      },
      err=>{
        console.log(err)
      }
    )
  }
}
