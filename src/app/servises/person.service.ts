import { Injectable } from '@angular/core';
import { ServerApiService } from './server-api.service';
import { Person, Lead, Action } from 'app/app.component';
import * as _ from "underscore";

@Injectable({providedIn: 'root'})

export class PersonService {
  persons:Person[];
  leads:Lead[];
  actions:Action[];
  constructor( private ServerApiService: ServerApiService) {}
  setPersons (callback) {
    let str = '';
    this.ServerApiService.fetchGet('/person/persons')
    .subscribe((persons:Person[])=>{
      this.ServerApiService.fetchGet('/person/actions')
      .subscribe((actions:Action[])=>{
        this.ServerApiService.fetchGet('/person/leads')
        .subscribe((leads:Lead[])=>{
          if (leads.length != persons.length) {
            console.log("Database ERROR: perssons = ",persons.length, " leads = ", leads.length)
          }
          let role = sessionStorage.getItem('role');
          if (role==='branch') {
            let branch = sessionStorage.getItem('branch');
            this.leads = _.where(leads,{branch_id: +branch});
            if (this.leads != null) {
              str = JSON.stringify(this.leads) ;
              sessionStorage.setItem('leads',str);
              let lll:number[] ;
              lll = _.pluck(this.leads, 'person_id');
              this.persons = _.filter(persons, (n)=>{ 
                return _.contains(lll, n.person_id);  //lll.includes(n.person_id);
              }); 
              str  = JSON.stringify(this.persons) ;
              sessionStorage.setItem('persons',str);
              this.actions = _.filter(actions, (n)=>{ 
                return _.contains(lll, n.person_id); 
              });
              str = JSON.stringify(this.actions) ;
              sessionStorage.setItem('actions',str);
              callback(1);
            } else callback(0);
          } else {
            //this.leads = _.where(leads,{source: !'INT'});
            
            this.leads = _.filter(leads, function(p){
              return _.includes(['PPC','SEO','SNL'], p.source);  
            });
            if (this.leads != null) {
              str = JSON.stringify(this.leads) ;
              sessionStorage.setItem('leads',str);
              let lll:number[] ;
              lll = _.pluck(this.leads, 'person_id');
              this.persons = _.filter(persons, (n)=>{ 
                return _.contains(lll, n.person_id);  //lll.includes(n.person_id);
              }); 
              str  = JSON.stringify(this.persons) ;
              sessionStorage.setItem('persons',str);
              this.actions = _.filter(actions, (n)=>{ 
                return _.contains(lll, n.person_id); 
              });
              str = JSON.stringify(this.actions) ;
              sessionStorage.setItem('actions',str);

              sessionStorage.setItem('dates_request','login');
            }
            /*
            str  = JSON.stringify(persons) ;
            sessionStorage.setItem('persons',str);
            str = JSON.stringify(actions) ;
            sessionStorage.setItem('actions',str);
            str = JSON.stringify(leads) ;
            sessionStorage.setItem('leads',str);
            */

            callback(1);
          }
        }, (error) => {
          console.log(error);
          callback(0);
        });
      }, (error) => {
        console.log(error);
        callback(0);
      });
    }, (error) => {
      console.log(error);
      callback(0);
    });  
  }
}