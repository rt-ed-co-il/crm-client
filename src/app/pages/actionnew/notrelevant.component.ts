import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Action, ActionStatus, LastEntries, UsersData, Branches, Lead, Person } from 'app/app.component';
import { ServerApiService } from 'app/servises/server-api.service';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
@Component({
  selector: 'notrelevant-new-cmp',
  moduleId: module.id,
  templateUrl: 'notrelevant.component.html',
  styleUrls: ['actionnew.component.css'],
  providers: [ServerApiService]
}) 
export class NotRelevantComponent {
  individualForm;
  submitted = false;
  action:Action;
  actions:Action[]=[];
  new_action_type: String ='';
  // changed 23-03
  lead:Lead;
  leads:Lead[] = [];
  person:Person;
  persons:Person[] = [];
// 
  lastEntrie: LastEntries;
  branches = Branches;
  nc:any;
  statuses = ActionStatus;
  user:UsersData;
  users:UsersData[]=[];
  rtuser:number;
  action_user:string = '';
  ActionError:String = '';
  ActionErrorText:String = '';
  constructor(
    private formBuilder: FormBuilder,
    private ServerApiService: ServerApiService,
    private toastr: ToastrService,
    private router: Router
  ) {
    let str:string;
    str = sessionStorage.getItem("individual2edit");
    this.lastEntrie = JSON.parse(str);
    // changed 23-03
    str = sessionStorage.getItem('leads');
    this.leads = JSON.parse(str);
    this.lead = _.findWhere(this.leads, {person_id: this.lastEntrie.person_id});
    str = sessionStorage.getItem('persons');
    this.persons = JSON.parse(str);
    this.person = _.findWhere(this.persons, {person_id: this.lastEntrie.person_id});
    // 
    this.nc= +this.person.no_call;
    this.new_action_type = sessionStorage.getItem("new_action_type");
    let create_user_id = sessionStorage.getItem("rtuser");
    str = sessionStorage.getItem('users');
    this.users = JSON.parse(str);
    this.user = _.findWhere(this.users, {rtuser: create_user_id});
    if (this.user != null) this.action_user = this.user.first_name+' '+this.user.last_name;
    this.individualForm = this.formBuilder.group({
      name:             this.person.first_name + ' ' + this.person.last_name,
      phone_1:          this.person.phone_1,
      email:            this.person.email,
      source:           this.lead.source, 
      no_call:          this.nc,
      type:             this.new_action_type,
      amount:           0,
      message:          ['', Validators.required],
      subject:          '',
      user_id:          create_user_id,
      create_user_id:   create_user_id,
      update_user_id:   0,
      status:           'new',
      create_date:      new Date(),
      start_date:       '',
      start_time:       '',
      due_date:         '',
      update_date:      '',
      priority:         'normal',
      location:         100,
      person_id:        this.lastEntrie.person_id
    });
  }
  //FORM FIELDS
  // convenience getter for easy access to form fields
  ChangingValue() {}
  get f() { return this.individualForm.controls; }
  onSubmit(actionData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.individualForm.invalid) {
      return;
    }
    // Process checkout data here
    let actionData2Server = {
      action: {
        action_id:        null,
        b_task_id:        0,
        b_client_id:      0,
        type:             actionData.type,
        amount:           actionData.amount,
        message:          actionData.message,
        subject:          actionData.subject,
        user_id:          actionData.user_id,
        create_user_id:   actionData.create_user_id,
        update_user_id:   actionData.update_user_id,
        status:           actionData.status,
        create_date:      new Date(),
        start_date:       null,
        due_date:         null,
        update_date:      null,
        priority:         actionData.priority,
        location:         actionData.location,
        person_id:        actionData.person_id
      }
    } 
    let strData = JSON.stringify(actionData2Server);
    this.ServerApiService.fetchNewAction(strData)
    .subscribe((data:number)=>{
      this.ActionError = '';
      this.toastr.success(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Set Not Relevant</span>',
        "",
        {
          timeOut: 1000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-success alert-with-icon",
          positionClass: "toast-top-center"
        }
      );
      // push to array
      actionData2Server.action.action_id = data[0];
      let str = sessionStorage.getItem('actions');
      this.actions = JSON.parse(str);
      //this.actions.push(actionData2Server.action);
      this.actions.unshift(actionData2Server.action);
      str = JSON.stringify(this.actions);
      sessionStorage.setItem('actions',str);
      this.router.navigate(['/person']);
    }, (error) => {
      this.ActionError = "Users error :" + error.status;
      this.ActionErrorText = error.error.reason;
    });
  }
  cancel() {
    this.router.navigate(['/person']);
  }
}