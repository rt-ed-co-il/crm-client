import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersData,ImgPath } from '../../app.component'; 


@Component({
  selector: 'users-cmp',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.css']
})
export class UsersComponent implements OnInit {
  usersData: UsersData[] = [];
  imgPath:string = ImgPath;
  constructor( 
    private router: Router
  ) { } 

  ngOnInit() {
    //request Users 
    let st:string = sessionStorage.getItem('users');
    this.usersData = JSON.parse(st);
  }
  editUser(user) {
    let st = JSON.stringify(user);
    sessionStorage.setItem("user2edit",st);
    this.router.navigate(['/user']);
  }
  showResults(user) {
    sessionStorage.setItem("consultant",user.first_name+' '+user.last_name);
    sessionStorage.setItem("category_cons",user.category);
    sessionStorage.setItem("rtuser_cons",user.rtuser);
    sessionStorage.setItem("role_cons",user.role);
    this.router.navigate(['/consultant']);
  }
  newUser() {
    console.log("New user");
    this.router.navigate(['/usernew']);
  }
}