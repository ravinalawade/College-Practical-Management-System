import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';
import { TeacherprofileComponent } from './teacherprofile/teacherprofile.component';
import { AuthGuard } from './auth/auth.guard';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'studentprofile', component: StudentprofileComponent,canActivate:[AuthGuard] },
  { path: 'teacherprofile', component: TeacherprofileComponent,canActivate:[AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
