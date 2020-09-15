import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import * as _ from "underscore";
import { ModalService } from '../../modal/modal.service';
import { Action, LastEntries, Lead, Person } from 'app/app.component';
import { ServerApiService } from 'app/servises/server-api.service';

@Component({
  selector: 'find-cmp',
  moduleId: module.id,
  templateUrl: 'find.component.html',
  providers: [ServerApiService]
}) 
 
export class FindComponent { 
  findForm;
  submitted = false;
  in_value='';
  lead:Lead;
  leads:Lead[] = [];
  person:Person;
  persons:Person[] = [];
  persons_data:Person[] = [];
  actions:Action[] = [];
  lastEntry:LastEntries;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private ServerApiService: ServerApiService
  ) {
    this.findForm = this.formBuilder.group({
      in_value: this.in_value})
  }
  // modal window
  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  ChangingValue() {}
  //get f() { return this.findForm.controls; }
  onSubmit(data) {
    this.in_value='';
    if (!data.in_value.trim()) {return;}
    let strData2Server = { 
      in_value: data.in_value
    }
    let strData = JSON.stringify(strData2Server);
    this.ServerApiService.fetchPersonsByString(strData)
    .subscribe((persons:Person[])=>{
      this.persons_data = persons;
      this.openModal('custom-modal-1');
    }, (error) => {
      console.log(error);
    }); 
  }
  //DataTables_Table_2_filter
  editIndividual(person:Person) {
    this.closeModal('custom-modal-1');
    let str = sessionStorage.getItem('persons');
    let persons_storage:Person[] = JSON.parse(str);
    let person_storage:Person = _.findWhere(persons_storage, {person_id: person.person_id});
    if (person_storage) this.openPerson(person.person_id);
    else {
      let personData2Server = { person_id: person.person_id }
      let str = JSON.stringify(personData2Server);
      this.ServerApiService.fetchActionsByPersonID(str)
      .subscribe((actions:Action[])=>{
        this.ServerApiService.fetchLeadByPersonID(str)
        .subscribe((leads:Lead[])=>{ 
          str = sessionStorage.getItem('leads');
          this.leads = JSON.parse(str);
          str = sessionStorage.getItem('persons');
          this.persons = JSON.parse(str);
          str = sessionStorage.getItem('actions');
          this.actions = JSON.parse(str);
          this.persons.push(person);
          this.leads.push(leads[0]);
          for ( let i=0; i<actions.length; i++) {
            this.actions.push(actions[i]);
          }
          str  = JSON.stringify(this.persons) ;
          sessionStorage.setItem('persons',str);
          str = JSON.stringify(this.actions) ;
          sessionStorage.setItem('actions',str);
          str = JSON.stringify(this.leads) ;
          sessionStorage.setItem('leads',str);
          this.openPerson(person.person_id);
        }, (error) => {console.log(error);}
        );
      }, (error) => {console.log(error);}
      );
    }
  }

  openPerson(person_id) {
    let entry: LastEntries = {
      person_id:person_id, first_name:'', last_name:'', email:'', 
      phone_1:'', phone_2:'', address:'', country_id:'', no_call:0, lead_id:0, 
      entry_timestamp:null, source:'', source_details:'', product_id:0, status:'New',
      product_single_id:0, branch_id:0, cv_file:'', cv_text:'', last_action_id:0, 
      last_action_type:'',last_action_message:'',  last_action_subject:'',
      last_action_user_id:0, last_action_create_user_id: 0, last_action_update_user_id:0, 
      last_action_create_date:null, last_action_start_date:null, last_action_due_date:null, 
      last_action_update_date:null, last_action_status:'', 
  };
    let st = JSON.stringify(entry);
    sessionStorage.setItem("individual2edit",st);
    this.router.navigate(['/person']);
  }

}
