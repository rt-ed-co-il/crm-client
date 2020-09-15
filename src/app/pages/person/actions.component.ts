import { Component } from '@angular/core';
import * as _ from "underscore";
import { Router } from '@angular/router';
import { Action, LastEntries, User, UsersData } from 'app/app.component';

@Component({
    selector: 'actions-cmp',
    moduleId: module.id,
    templateUrl: 'actions.component.html'
}) 
export class ActionsComponent {
    lastEntrie: LastEntries;
    action:Action[] = [];
    actions:Action[] = [];
    constructor(
        private router: Router
      ) {
        let str:string;
        str = sessionStorage.getItem("individual2edit");
        this.lastEntrie = JSON.parse(str);
        str = sessionStorage.getItem('actions');
        this.actions = JSON.parse(str);
        this.action = _.where(this.actions, {person_id: this.lastEntrie.person_id});
        this.action.sort(function (a, b) {
          if (a.create_date > b.create_date) { return -1; }
          if (a.create_date < b.create_date) { return 1; }
          return 0;
        });
        let users:UsersData[] = [];
        str = sessionStorage.getItem('users');
        users = JSON.parse(str);
        let user:UsersData;
        for (let i=0; i<this.action.length; i++) {
          user = _.findWhere(users, {rtuser: ''+this.action[i].user_id});
          if (user != null) {
            this.action[i].subject = user.first_name+' '+user.last_name;
          } else {
            this.action[i].subject = ''+this.action[i].create_user_id;
          }
        }
      }
    //TABLE OF ACTIONS
    UpdateActtion(act) {
      if (act.type ==='Appointment' || act.type ==='Task') {
        let st = JSON.stringify(act);
        sessionStorage.setItem("action",st);
        this.router.navigate(['/action']);
      }
    }
}