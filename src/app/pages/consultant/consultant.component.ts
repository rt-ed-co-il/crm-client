import { Component, OnInit } from '@angular/core';
import { LastEntries, Lead, Action, Person } from 'app/app.component';
import { Router } from '@angular/router';
import * as _ from "underscore";

@Component({
    selector: 'consultant-cmp',
    moduleId: module.id,
    templateUrl: 'consultant.component.html',
    styleUrls: ['consultant.component.css']
})
export class ConsultantComponent implements OnInit {
    leads:            Lead[] = [];
    actions:          Action[] = [];
    persons:          Person[] = [];
    lastEntries:      LastEntries[] = [];
    newEntries:       LastEntries[] = [];
    newEntriesSCO:    LastEntries[] = [];
    newEntriesJOB:    LastEntries[] = [];
    meetingsEntries:  LastEntries[] = [];
    tipulEntries:     LastEntries[] = [];
    infoEntries:      LastEntries[] = [];
    category = '';
    consultant = '';
    rtuser = 0;
    branch = false;
    constructor(
        private router: Router,
    ) { 
        let role = sessionStorage.getItem('role_cons');
        if (role==='branch') this.branch = true;
    } 
    ngOnInit() {
        sessionStorage.setItem('prev_page_user','consultant');
        let str:string;
        let data1: LastEntries[] = [];
        let data2: LastEntries[] = [];
        str = sessionStorage.getItem('leads');
        this.leads = JSON.parse(str);
        str = sessionStorage.getItem('persons');
        this.persons = JSON.parse(str);
        str = sessionStorage.getItem('actions');
        this.actions = JSON.parse(str);
        this.consultant = sessionStorage.getItem('consultant');
        this.category = sessionStorage.getItem('category_cons');
        this.rtuser = +sessionStorage.getItem('rtuser_cons');
        this.CreateLastEntries();
        this.newEntries = _.where(this.lastEntries, {last_action_type: 'LID'});
        this.newEntries.sort(function (a, b) {
            if (a.last_action_create_date > b.last_action_create_date) { return -1; }
            if (a.last_action_create_date < b.last_action_create_date) { return 1; }
            return 0;
        });
        this.newEntriesSCO = _.filter(this.newEntries, function(p){
            return _.includes(['PPC','SEO','SNL'], p.source);  
        });
        this.newEntriesJOB = _.where(this.newEntries, {source: 'INT'});
        data1 = _.filter(this.lastEntries, function(d){ 
            return new Date(d.last_action_start_date) <= new Date(new Date().getTime() + 12 * 60 * 60 * 1000);; 
        });
        data1.sort(function (a, b) {
            if (a.last_action_start_date > b.last_action_start_date) { return -1;}
            if (a.last_action_start_date < b.last_action_start_date) { return 1;}
            return 0;
        });
        //_.sortBy(data1, function(d){ return - new Date(d.last_action_start_date); });
        if (this.category==='sales') {
            data2 = _.where(data1, {last_action_type: 'Appointment'});
            this.meetingsEntries = _.where(data2, {last_action_user_id: this.rtuser});
            data2 = _.where(data1, {last_action_type: 'Task'});
            this.tipulEntries = _.where(data2, {last_action_user_id: this.rtuser});
            data1 = _.filter(this.lastEntries, function(p){
                return _.includes(['Comment','SMS','Email'], p.last_action_type);  
            });
            this.infoEntries = _.where(data1, {last_action_user_id: this.rtuser});
        } else {
            this.meetingsEntries = _.where(data1, {last_action_type: 'Appointment'});
            this.tipulEntries = _.where(data1, {last_action_type: 'Task'});
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

    editIndividual(entry:LastEntries) {
        let st = JSON.stringify(entry);
        sessionStorage.setItem("individual2edit",st);
        this.router.navigate(['/person']);
    }
    CreateLastEntries () {
        /*this.actions.sort(function (a, b) {
            if (a.create_date > b.create_date) { return -1; }
            if (a.create_date < b.create_date) { return 1; }
            return 0;
        });*/
        for (let i=0; i<this.persons.length; i++) {
            let cleads:Lead = _.findWhere(this.leads, {person_id: this.persons[i].person_id});
            let caction:Action = _.findWhere(this.actions, {person_id: this.persons[i].person_id});
            if (caction) {
                if (caction.status === 'new') {
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
                        status:                     cleads.status,
                        cv_file:                    cleads.cv_text,
                        cv_text:                    cleads.cv_text,
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
