import { Component, OnInit } from '@angular/core';
import { Lead, Action, LastEntries, Person } from 'app/app.component';
import { Router } from '@angular/router';
import * as _ from "underscore";

@Component({
    selector: 'persons-cmp',
    moduleId: module.id,
    templateUrl: 'persons.component.html',
    styleUrls: ['persons.component.css']
})

export class PersonsComponent implements OnInit{
    leads:Lead[] = [];
    actions:Action[] = [];
    persons:Person[] = [];
    lastEntries: LastEntries[] = [];
    branch = false;
    constructor(
        private router: Router
    ) { } 

    ngOnInit() {
        sessionStorage.setItem('prev_page_user','persons');
        let str:string;
        str = sessionStorage.getItem('leads');
        this.leads = JSON.parse(str);
        str = sessionStorage.getItem('persons');
        this.persons = JSON.parse(str);
        str = sessionStorage.getItem('actions');
        this.actions = JSON.parse(str);
        let role = sessionStorage.getItem('role');
        if (role==='branch') this.branch = true;
        this.CreateLastEntries();
        this.lastEntries.sort(function (a, b) {
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
