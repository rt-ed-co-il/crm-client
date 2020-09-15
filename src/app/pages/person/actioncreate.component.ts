import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import * as _ from "underscore";
import { ToastrService } from "ngx-toastr";
import { ActionType, Lead, Person, LastEntries } from 'app/app.component';


@Component({
    selector: 'action-create-cmp',
    moduleId: module.id,
    templateUrl: 'actioncreate.component.html'
}) 
 
export class ActionCreateComponent { 
  actionsForm;
  actions:String[] = ActionType;
  submitted = false;
  lead:Lead;
  leads:Lead[] = [];
  person:Person;
  persons:Person[] = [];
  lastEntrie: LastEntries;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) 
  {
    this.actionsForm = this.formBuilder.group({
      action: this.actions[0]
    })
  }
  get f() { return this.actionsForm.controls; }
  ChangingValue(e) {
    sessionStorage.setItem("new_action_type",this.actionsForm.value.action);
    switch (this.actionsForm.value.action) {
      case 'Appointment':
        this.router.navigate(['/apointment']);
        break;
      case 'Task':
        this.router.navigate(['/task']);
        break;
      case 'SMS':
        this.router.navigate(['/message']);
        break;
      case 'Email':
        this.router.navigate(['/message']);
        break;
      case 'NotRelevant':
        this.router.navigate(['/notrelevant']);
        break;
      case 'Proposal':
        let str = sessionStorage.getItem("individual2edit");
        this.lastEntrie = JSON.parse(str);
        str = sessionStorage.getItem('leads');
        this.leads = JSON.parse(str);
        this.lead = _.findWhere(this.leads, {person_id: this.lastEntrie.person_id});
        str = sessionStorage.getItem('persons');
        this.persons = JSON.parse(str);
        this.person = _.findWhere(this.persons, {person_id: this.lastEntrie.person_id});
        console.log(this.lead.product_id,this.person.country_id)
        if (this.lead.product_id>0 && this.person.country_id !== '') {
          this.router.navigate(['/contractnnew']);
        } else {
          this.toastr.warning(
            '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Please fill TEUDAT ZEHUT & COURSES before create Contract</span>',
              "",
              {
                timeOut: 4000,
                closeButton: true,
                enableHtml: true,
                toastClass: "alert alert-warning alert-with-icon",
                positionClass: "toast-top-center"
              }
            );
        }
        break;
    }
  }


}