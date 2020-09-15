import { Component, OnInit, Renderer, ViewChild, ElementRef, Input, EventEmitter } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { AuthService } from '../../servises/auth.service';
import { ServerApiService } from '../../servises/server-api.service';
import { IsLoggedService } from '../../servises/is-logged.service';
import { ImgPath } from 'app/app.component';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    providers: [ServerApiService]
})

export class NavbarComponent implements OnInit{
  ImgPath:string = ImgPath;
  isUserLoggedIn: boolean = false;
  isAdmin: boolean = false;
  first_name: string = '';
  last_name: string = '';
  photo: string = '';
  role: string = '';
  branch: boolean = false;

  /* Other */  
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  public isCollapsed = true;
  @ViewChild("navbar-cmp", {static: false}) button;
  constructor(
    location:Location, 
    private renderer : Renderer, 
    private element : ElementRef, 
    private IsLoggedService: IsLoggedService,
    private ServerApiService: ServerApiService,
    private router: Router,
    private AuthService: AuthService
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }
  ngOnInit(){
    this.IsLoggedService.isUserLoggedIn.subscribe((userLoggedIn: boolean) => {
      if (userLoggedIn) {
        this.isUserLoggedIn = userLoggedIn;
        this.first_name = sessionStorage.getItem("first_name");
        this.last_name = sessionStorage.getItem("last_name");
        this.photo = sessionStorage.getItem("photo");
        this.role = sessionStorage.getItem("role");
        let l:number = this.role.localeCompare("admin");
        if (l == 0) {this.isAdmin = true;} else {this.isAdmin = false;}
        if (this.role==='branch') this.branch = true;
      }
    });
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    var navbar : HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
  }

  /* Login & Users methods */
  startLogin() {
    this.router.navigate(['/']);
  }
  startLogout() {
    this.IsLoggedService.setUserLoggedIn(false);
    this.isUserLoggedIn = false;
    sessionStorage.clear();
    this.AuthService.logout();
    this.router.navigate(['/']);
  }
  startUsers() {
    this.router.navigate(['/users']);
  }
  chat() {
    this.router.navigate(['/chat']);
  }
  settings() {
    this.router.navigate(['/notifications']);
  }
  /* other */
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
      titlee = titlee.slice( 1 );
    }
    for(var item = 0; item < this.listTitles.length; item++){
      if(this.listTitles[item].path === titlee){
        return this.listTitles[item].title;
      }
    }
    return; // 'Dashboard';
  }
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
    setTimeout(function(){
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  };
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
    if (window.innerWidth < 991) {
      setTimeout(function(){
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };
  collapse(){
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    }else{
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }
  }

}
