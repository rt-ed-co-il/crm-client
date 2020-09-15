import { Component, ViewChild, ElementRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput, DayTable, computeEventEndResizable } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormBuilder } from "@angular/forms";
import * as _ from "underscore";
import { ModalService } from '../../modal/modal.service';
import { Action, LastEntries, Lead, Person, ActionStatus } from 'app/app.component';
import { ServerApiService } from 'app/servises/server-api.service';
import { LeadStatusService } from 'app/servises/leadstatus.service';
import { Router } from '@angular/router';

@Component({ 
  selector: 'fullcal-cmp',
  moduleId: module.id,
  templateUrl: 'fullcall.component.html',
  providers: [ServerApiService]
})
export class FullCalComponent {
  individualForm;
  submitted = false;
  event:any;
  bodyText: string;
  leads:Lead[] = [];
  persons:Person[] = [];
  statuses = ActionStatus;
  entry:LastEntries;
  action:Action;
  actions:Action[] = [];
  lastEntries: LastEntries[] = [];
  calendar:Action[] = [];
  ActionError:String = '';
  ActionErrorText:String = '';
  constructor(
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private modalService: ModalService,
    private ServerApiService: ServerApiService,
    private LeadStatusService: LeadStatusService,
    private router: Router
  ) {}
 
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent; // the #calendar in the template
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];

  ngOnInit() {
    // fullcalendar
    let str:string = sessionStorage.getItem('actions');
    this.actions = JSON.parse(str);
    let color:string = '';
    this.calendar = JSON.parse(str);
    str = sessionStorage.getItem('leads');
    this.leads = JSON.parse(str);
    str = sessionStorage.getItem('persons');
    this.persons = JSON.parse(str);
    for (let i=0; i<this.calendar.length; i++) {
      if (this.calendar[i].start_date !== null && this.calendar[i].type ==='Appointment') {
        this.CreateLastEntry(this.calendar[i]);
        if (this.calendar[i].status === 'new')            color='#FFC300'
        else if (this.calendar[i].status === 'canceled')  color='#C70039'
        else if (this.calendar[i].status === 'completed') color='GREEN' 
        this.calendarEvents = this.calendarEvents.concat({ 
          title:            this.entry.first_name+' '+this.entry.last_name,
          start:            this.calendar[i].start_date,
          borderColor:      color,
          backgroundColor:  color,
          person_id:        this.calendar[i].person_id,
        });
      }
    }
    // modal window
    this.bodyText = 'This text can be updated in modal 1';
    this.individualForm = this.formBuilder.group({
      subject: '',
      status:  '',
    });
  }

// modal window
openModal(id: string) {
  this.modalService.open(id);
}
closeModal(id: string) {
  this.modalService.close(id);
}
// fullcalendar
toggleVisible() {
  this.calendarVisible = !this.calendarVisible;
}
toggleWeekends() {
  this.calendarWeekends = !this.calendarWeekends;
}
gotoPast() {
  let calendarApi = this.calendarComponent.getApi();
  calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
}
handleDateClick(arg) {
  console.log('possible new event here');
}
eventClick (info) {
    // prepare data
    this.event = info.event;
    this.entry =  _.findWhere(this.lastEntries, {person_id: info.event.extendedProps.person_id});

    this.individualForm = this.formBuilder.group({
      subject:this.entry.last_action_subject,
      status: this.entry.last_action_status,
    });
    this.openModal('custom-modal-1');
}
get f() { return this.individualForm.controls; }
ChangingValue(e) {}
onSubmit(actionData) {
  this.submitted = true;
  // stop here if form is invalid
  if (this.individualForm.invalid) {
    return;
  }
  this.entry.last_action_subject = actionData.subject;
  this.entry.last_action_status = actionData.status;
  // Process checkout data here
  this.action = _.findWhere(this.actions, {action_id: this.entry.last_action_id});
  let user_id = sessionStorage.getItem("rtuser");
  let actionData2Server = {
    action: {
      action_id:      this.action.action_id,
      message:        this.entry.last_action_message,
      subject:        actionData.subject,
      user_id:        this.action.user_id,
      update_user_id: user_id,
      status:         actionData.status,
      create_date:    new Date(this.action.create_date),
      start_date:     new Date(this.action.start_date),
      due_date:       new Date(this.action.due_date),
      update_date:    new Date(),
      priority:       this.action.priority,
      location:       this.action.location,
    }
  }
  let strData = JSON.stringify(actionData2Server);
  this.ServerApiService.fetchActionUpdate(strData)
  .subscribe((data:number)=>{
    this.ActionError = '';
    this.action.subject = actionData.subject;
    this.action.update_user_id = +user_id;
    this.action.status = actionData.status;
    strData = JSON.stringify(this.actions);
    sessionStorage.setItem('actions',strData);
    let color:any;
    let lead_status:string;
    if (actionData.status === 'new'){
      color='#FFC300';
      lead_status = "New";
    } else if (actionData.status === 'canceled') {
      color='#C70039'
      lead_status = "New";
    } else if (actionData.status === 'completed') {
      color='GREEN' 
      lead_status = "Meeting";
    }
    this.event.setProp('borderColor',color);
    this.event.setProp('backgroundColor',color);
    this.LeadStatusService.changeLidStatus(this.action.person_id,lead_status,(result)=>{
      this.closeModal('custom-modal-1');
    })
  }, (error) => {
    console.log(error);
    this.ActionError = "Users error :" + error.status;
    this.ActionErrorText = error.error.reason;
  });
}
editIndividual(entry:LastEntries) {
  this.closeModal('custom-modal-1');
  let st = JSON.stringify(entry);
  sessionStorage.setItem("individual2edit",st);
  sessionStorage.setItem('prev_page_user','fullcal');
  this.router.navigate(['/person']);
}
CreateLastEntry (action:Action) {
  let lead:Lead =      _.findWhere(this.leads, {person_id: action.person_id});
  let person:Person =  _.findWhere(this.persons, {person_id: action.person_id});
  this.entry= {
      person_id:                  person.person_id,
      first_name:                 person.first_name,
      last_name:                  person.last_name,
      email:                      person.email,
      phone_1:                    person.phone_1,
      phone_2:                    person.phone_2,
      address:                    person.address,
      country_id:                 person.country_id,
      no_call:                    person.no_call,
      lead_id:                    lead.lead_id,
      entry_timestamp:            lead.entry_timestamp,
      source:                     lead.source,
      source_details:             lead.source_details,
      product_id:                 lead.product_id,
      product_single_id:          lead.product_single_id,
      branch_id:                  lead.branch_id,
      status:                     lead.status,
      cv_file:                    lead.cv_text,
      cv_text:                    lead.cv_text,
      last_action_id:             action.action_id,
      last_action_type:           action.type,
      last_action_message:        action.message,
      last_action_subject:        action.subject,
      last_action_user_id:        action.user_id,
      last_action_create_user_id: action.create_user_id,
      last_action_update_user_id: action.update_user_id,
      last_action_create_date:    action.create_date,
      last_action_start_date:     action.start_date,
      last_action_due_date:       action.due_date,
      last_action_update_date:    action.update_date,
      last_action_status:         action.status,
  };
  this.lastEntries.push(this.entry);
}
}

