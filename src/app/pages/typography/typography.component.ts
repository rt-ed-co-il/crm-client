import { Component, OnInit } from '@angular/core';
import { LastEntries, Lead, Action, Person } from 'app/app.component';
import { Router } from '@angular/router';
import * as _ from "underscore";
import { PersonService } from 'app/servises/person.service';
import { ToastrService } from "ngx-toastr";
//import { Location } from '@angular/common';
@Component({
    selector:       'typography-cmp',
    moduleId:       module.id,
    templateUrl:    'typography.component.html',
    styleUrls:      ['typography.component.css'],
    providers:      [PersonService]
})
export class TypographyComponent implements OnInit {
    leads:              Lead[] = [];
    actions:            Action[] = [];
    persons:            Person[] = [];
    lastEntries:        LastEntries[] = [];
    newEntries:         LastEntries[] = [];
    newEntriesSCO:      LastEntries[] = [];
    tipulEntries:       LastEntries[] = [];
    meetingsEntries:    LastEntries[] = [];
    beforeMeeting:      LastEntries[] = [];
    infoEntries:        LastEntries[] = [];
    category =          '';
    rtuser =            0;
    branch =            false;
    sales =             false;
    constructor(
        private router: Router,
        private toastr: ToastrService,
        private PersonService: PersonService
    ) { 
        let role = sessionStorage.getItem('role');
        if (role==='branch') this.branch = true;
    } 
    ngOnInit() {
        sessionStorage.setItem('prev_page_user','typography');
        let str:string;
        let data1: LastEntries[] = [];
        let data2: LastEntries[] = [];
        let bef_m: LastEntries[] = [];
        let aft_m: LastEntries[] = [];
        str = sessionStorage.getItem('leads');
        this.leads = JSON.parse(str);
        str = sessionStorage.getItem('persons');
        this.persons = JSON.parse(str);
        str = sessionStorage.getItem('actions');
        this.actions = JSON.parse(str);
        this.category = sessionStorage.getItem('category');
        if (this.category==='sales') this.sales = true;
        this.rtuser = +sessionStorage.getItem('rtuser');
        this.CreateLastEntries();
        //LID
        this.newEntries = _.where(this.lastEntries, {last_action_type: 'LID'});
        this.newEntries.sort(function (a, b) {
            if (a.last_action_create_date > b.last_action_create_date) { return -1; }
            if (a.last_action_create_date < b.last_action_create_date) { return 1; }
            return 0;
        });
        this.newEntriesSCO = _.filter(this.newEntries, function(p){
            return _.includes(['PPC','SEO','SNL'], p.source);  
        });
        //Cut on today
        let t = new Date();
        let ts = ''+t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate()+' 23:50:00';
        let td = new Date (ts);
        console.log(td);
        data1 = _.filter(this.lastEntries, function(d){ 
            //return new Date(d.last_action_start_date) <= new Date(new Date().getTime() + 24 * 60 * 60 * 1000);; 
            return new Date (d.last_action_start_date) < td;
        });
        data1.sort(function (a, b) {
            if (a.last_action_start_date > b.last_action_start_date) { return -1;}
            if (a.last_action_start_date < b.last_action_start_date) { return 1;}
            return 0;
        }); 

        bef_m = _.filter(data1, function(p){
            return _.includes(['New'], p.status);  
        });
        aft_m = _.filter(data1, function(p){
            return _.includes(['Meeting'], p.status);  
        });

        if (this.sales) {
            data2 = _.where(data1, {last_action_type: 'Appointment'});
            this.meetingsEntries = _.where(data2, {last_action_user_id: this.rtuser});

            data2 = _.where(bef_m, {last_action_type: 'Task'});
            this.beforeMeeting = _.where(data2, {last_action_user_id: this.rtuser});
            data2 = _.where(aft_m, {last_action_type: 'Task'});
            this.tipulEntries = _.where(data2, {last_action_user_id: this.rtuser});

            data1 = _.filter(this.lastEntries, function(p){
                return _.includes(['Comment','SMS','Email'], p.last_action_type);  
            });
            this.infoEntries = _.where(data1, {last_action_user_id: this.rtuser});
        } else {
            this.meetingsEntries = _.where(data1, {last_action_type: 'Appointment'});
            this.beforeMeeting = _.where(bef_m, {last_action_type: 'Task'});
            this.tipulEntries = _.where(aft_m, {last_action_type: 'Task'});
            this.infoEntries = _.filter(this.lastEntries, function(p){
                return _.includes(['Comment','SMS','Email'], p.last_action_type);  
            });
        }

        this.infoEntries.sort(function (a, b) {
            if (a.last_action_create_date > b.last_action_create_date) { return -1; }
            if (a.last_action_create_date < b.last_action_create_date) { return 1; }
            return 0;
        });
    }
    refresh() { 
        this.PersonService.setPersons((p)=>{
            if (p) {
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true })
                .then(() => {
                    this.toastr.success(
                        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Data Refreshed</span>',
                        "",
                        {
                          timeOut: 1000,
                          closeButton: true,
                          enableHtml: true,
                          toastClass: "alert alert-success alert-with-icon",
                          positionClass: "toast-top-center"
                        }
                      );
                    this.router.navigate(['/typography']);
                }); 
            } else console.log("error",p);
        }); 
    }
    editIndividual(entry:LastEntries) {
        let st = JSON.stringify(entry);
        sessionStorage.setItem("individual2edit",st);
        this.router.navigate(['/person']);
    }
    getColor(status) {
        switch (status) {
          case 'New':
            return 'white';
          case 'Meeting':
            return 'khaki';
          case 'Student':
            return 'paleturquoise';
        }
      }
    CreateLastEntries () {
        //console.log(this.actions);
        for (let i=0; i<this.persons.length; i++) {
            let cleads:Lead = _.findWhere(this.leads, {person_id: this.persons[i].person_id});
            let caction:Action = _.findWhere(this.actions, {person_id: this.persons[i].person_id});
            if (caction) {
                if (caction.status === 'new') {
                    //console.log(this.persons[i].person_id);
                    let lastEntrie: LastEntries = {
                        person_id:                  this.persons[i].person_id,
                        first_name:                 this.persons[i].first_name,
                        last_name:                  this.persons[i].last_name,
                        email:                      this.persons[i].email,
                        phone_1:                    this.persons[i].phone_1,
                        phone_2:                    this.persons[i].phone_2,
                        address:                    this.persons[i].address,
                        country_id:                 this.persons[i].country_id,
                        no_call:                    this.persons[i].no_call,
                        lead_id:                    cleads.lead_id,
                        entry_timestamp:            cleads.entry_timestamp,
                        source:                     cleads.source,
                        source_details:             cleads.source_details,
                        product_id:                 cleads.product_id,
                        product_single_id:          cleads.product_single_id,
                        branch_id:                  cleads.branch_id,
                        cv_file:                    cleads.cv_text,
                        cv_text:                    cleads.cv_text,
                        status:                     cleads.status,
                        last_action_id:             caction.action_id,
                        last_action_type:           caction.type,
                        last_action_message:        caction.message,
                        last_action_subject:        caction.subject,
                        last_action_user_id:        caction.user_id,
                        last_action_create_user_id: caction.create_user_id,
                        last_action_update_user_id: caction.update_user_id,
                        last_action_create_date:    caction.create_date,
                        last_action_start_date:     caction.start_date,
                        last_action_due_date:       caction.due_date,
                        last_action_update_date:    caction.update_date,
                        last_action_status:         caction.status,
                    }
                    this.lastEntries.push(lastEntrie);
                }
            }
        }
    }
}
