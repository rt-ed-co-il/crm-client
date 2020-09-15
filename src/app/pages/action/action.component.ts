import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Action, ActionStatus, LastEntries, UsersData, Branches, Person, Lead } from 'app/app.component';
import { Router } from '@angular/router';
import { ServerApiService } from 'app/servises/server-api.service';
import * as _ from "underscore";
import { DatePipe } from '@angular/common';
import { LeadStatusService } from 'app/servises/leadstatus.service';
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'action-cmp',
  moduleId: module.id,
  templateUrl: 'action.component.html',
  styleUrls: ['action.component.css'],
  providers: [ServerApiService]
})
export class ActionComponent {
  individualForm;
  submitted = false;
  action:Action;
  actions:Action[]=[];
  new_action_type: String ='';
  lead:Lead;
  leads:Lead[] = [];
  person:Person;
  persons:Person[] = [];
  lastEntrie: LastEntries;
  branches = Branches;
  nc:any;
  statuses = ActionStatus;
  user:UsersData;
  users:UsersData[]=[];
  rtuser:number;
  action_input:Action;
  ActionError:String = '';
  ActionErrorText:String = '';
  action_user:string = '';
  action_create_user:string = '';
  action_update_user:string = '';
  startDate:any;
  startTime:any;
  update_date:Date;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ServerApiService:   ServerApiService,
    private LeadStatusService:  LeadStatusService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    let str:string;
    str = sessionStorage.getItem("individual2edit");
    this.lastEntrie = JSON.parse(str);
    str = sessionStorage.getItem('leads');
    this.leads = JSON.parse(str);
    this.lead = _.findWhere(this.leads, {person_id: this.lastEntrie.person_id});
    str = sessionStorage.getItem('persons');
    this.persons = JSON.parse(str);
    this.person = _.findWhere(this.persons, {person_id: this.lastEntrie.person_id});
    this.nc= +this.person.no_call;
    str = sessionStorage.getItem('action');
    this.action_input = JSON.parse(str);
    str = sessionStorage.getItem('actions');
    this.actions = JSON.parse(str);
    this.action = _.findWhere(this.actions, {action_id: this.action_input.action_id});
    this.nc= +this.lastEntrie.no_call;
    let create_user_id = sessionStorage.getItem("rtuser");
    str = sessionStorage.getItem('users');
    this.users = JSON.parse(str);
    this.user = _.findWhere(this.users, {rtuser: create_user_id});
    if (this.user != null) this.action_user = this.user.first_name+' '+this.user.last_name;
    
    let date1:Date = new Date(this.action.start_date);
    this.startDate = this.datePipe.transform(date1, 'yyyy-MM-dd');
    this.startTime = this.datePipe.transform(date1, 'HH:mm');
    this.update_date = new Date();

    this.individualForm = this.formBuilder.group({
      no_call:          this.nc,
      message:          this.action.message,
      user_id:          this.action.user_id,
      status:           this.action.status,
      start_date:       this.startDate,
      start_time:       this.startTime,
      update_date:      this.update_date,
      priority:         this.action.priority,
      location:         this.action.location,
    });
  }
  //FORM FIELDS
  // convenience getter for easy access to form fields
  get f() { return this.individualForm.controls; }
  ChangingValue(e) {}
  onSubmit(actionData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.individualForm.invalid) { return; }
    // Process checkout data here
    let actionData2Server = {
      action: {
        action_id:      this.action.action_id,
        b_task_id:      this.action.b_task_id,
        b_client_id:    this.action.b_client_id,
        type:           this.action.type,
        amount:         this.action.amount,
        message:        actionData.message,
        subject:        this.action.subject,
        user_id:        actionData.user_id,
        create_user_id: this.action.create_user_id,
        update_user_id: this.rtuser,
        status:         actionData.status,
        create_date:    new Date(),
        start_date:     new Date(actionData.start_date + ' ' + actionData.start_time ),
        due_date:       new Date(actionData.start_date + ' ' + actionData.start_time ),
        update_date:    new Date(),
        priority:       this.action.priority,
        location:       this.action.location,
        person_id:      this.action.person_id
      }
    }
    let strData = JSON.stringify(actionData2Server);
    this.ServerApiService.fetchActionUpdate(strData)
    .subscribe((data:number)=>{
      this.ActionError = '';
      if (this.action.type === "Appointment") {
        if (this.action.status !== actionData.status) {
          let lead_status:string;
          if (actionData.status === 'new'){lead_status = "New"} 
          else if (actionData.status === 'canceled') {lead_status = "New"} 
          else if (actionData.status === 'completed') {lead_status = "Meeting";}
          this.LeadStatusService.changeLidStatus(this.action.person_id,lead_status,(result)=>{
           
          })
        }
      }
      this.action.message         = actionData.message;
      this.action.user_id         = actionData.user_id;
      this.action.update_user_id  = actionData.update_user_id;
      this.action.create_date     = new Date();
      this.action.start_date      = new Date(actionData.start_date + ' ' + actionData.start_time ),
      this.action.due_date        = new Date(actionData.start_date + ' ' + actionData.start_time ),
      this.action.status          = actionData.status;
      let str:string = JSON.stringify(this.actions);
      sessionStorage.setItem('actions',str);
      this.toastr.success(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Action Updated</span>',
        "",
        {
          timeOut: 1000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-success alert-with-icon",
          positionClass: "toast-top-center"
        }
      );
      this.router.navigate(['/person']);

    }, (error) => {
       console.log(error);
      this.ActionError = "Users error :" + error.status;
      this.ActionErrorText = error.error.reason;
    });
  }
  cancel() {
    this.router.navigate(['/person']);
  }
}