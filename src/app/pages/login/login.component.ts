import { Component, OnInit } from '@angular/core';
import { ServerApiService } from '../../servises/server-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../servises/auth.service';
import { User, UsersData, Product, ProductGroup } from '../../app.component'; 
import { IsLoggedService } from '../../servises/is-logged.service';
import { PersonService } from '../../servises/person.service';

@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [
    ServerApiService,
    PersonService
  ]
})

export class LoginComponent implements OnInit {
  user = ''
  password = ''
  loginError = '';
  loginErrorText = '';
  constructor(
    private ServerApiService: ServerApiService,
    private IsLoggedService: IsLoggedService,
    private PersonService: PersonService,
    private AuthService: AuthService,    
    private router: Router,
    ) { }

  ngOnInit() {}

  getLogin() {
    if (!this.user.trim() && !this.password.trim()) {
      return;
    }
    // request Login
    this.ServerApiService.fetchLogin(this.user,this.password)
    .subscribe((data:User)=>{
      sessionStorage.setItem('token', data.user.token);
      sessionStorage.setItem('role', data.user.role);
      sessionStorage.setItem('category', data.user.category);
      sessionStorage.setItem('rtuser', data.user.rtuser); 
      sessionStorage.setItem('first_name',data.user.first_name);
      sessionStorage.setItem('last_name',data.user.last_name);
      sessionStorage.setItem('photo',data.user.photo);
      sessionStorage.setItem('branch',data.user.branch);
      this.IsLoggedService.setUserLoggedIn(true);
      this.AuthService.login();
      this.ServerApiService.fetchGet('/users/userlist')
      .subscribe((data:UsersData[])=>{
        let st:string = JSON.stringify(data);
        sessionStorage.setItem('users',st);
        this.ServerApiService.fetchGet('/student/readproductgroup')
        .subscribe((data:ProductGroup[])=>{
          let st:string = JSON.stringify(data);
          sessionStorage.setItem('productgroup',st);
          this.ServerApiService.fetchGet('/student/readproduct')
          .subscribe((data:Product[])=>{
            let st:string = JSON.stringify(data);
            sessionStorage.setItem('product',st);
            //this.router.navigate(['/typography']);            
            this.PersonService.setPersons((p)=>{
              if (p) this.router.navigate(['/typography']);
              else console.log("error",p);
            });
          }, (error) => {
            console.log(error);
          });
        }, (error) => {
          console.log(error);
        });
      },(error) => {
        console.log(error);
        this.loginError = "DB Users error :" + error.status;
        this.loginErrorText = error.statusText;
      });
    },(error) => {
      console.log(error);
      this.loginError = "Login error :" + error.status;
      this.loginErrorText = error.statusText;
      setTimeout(this.loginErrorText ='',5000);
      this.user = '';
      this.password = '';
    });
  } 
}
