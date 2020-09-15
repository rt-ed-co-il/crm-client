import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from "underscore";
import { ServerApiService } from '../../servises/server-api.service';
import { StatisticRecord, StatisticTable, LastEntries, Person, Action, Lead, LeadsReport } from 'app/app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalService } from 'app/modal/modal.service';
import { Router } from '@angular/router';

@Component({
    selector: 'jobmaster-cmp',
    moduleId: module.id,
    templateUrl: 'jobmaster.html',
    styleUrls: ['jobmaster.css']
})

export class JobMasterComponent implements OnInit{
  personForm;
  statistic:      boolean = false;
  leadsReport:    LeadsReport[]=[];
  stat_record:    StatisticRecord;
  stat_table:     StatisticTable[] = [];
  contract_amount:number = 0;
  branch:         boolean = false;
  intEnd:         string;
  intStart:       string;
  persons:        Person[] = [];
  leads:          Lead[]=[];
  actions:        Action[]=[];
  
  constructor(
    private ServerApiService: ServerApiService,
    private modalService: ModalService,
    private router: Router,
  ) {
    this.intEnd = moment().format('yyyy-MM-DD');
    this.intStart = moment().add(-30, 'days').format('yyyy-MM-DD');
    console.log(this.intEnd, this.intStart );
    this.personForm = new FormGroup({
      statisticStartDate: new FormControl(this.intStart),
      statisticEndDate: new FormControl(this.intEnd),
    });
  }
  // modal window
  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  ngOnInit(){
    let role = sessionStorage.getItem('role');
    if (role==='branch') this.branch = true;
    if (this.branch) {} else {
      this.requestStatistic(30,0);
    }
  }

  requestStatistic (intEnd,intStart) {
    this.statistic = false;
    let statReqesr = {
      interval:{
        intEnd:intEnd,
        intStart:intStart,
      }
    }
    let strData = JSON.stringify(statReqesr);
    this.ServerApiService.fetchJobMaster(strData)
    .subscribe((data:LeadsReport[])=>{     
      console.log(data);
      this.leadsReport = data;
      this.statistic = true;
    }, (error) => {
      console.log(error);
    });
  }

  showStatistic() {
    let now = moment();
    let start_m = moment(this.personForm.value.statisticStartDate);
    let start:number = now.diff(start_m,'days');
    let end_m = moment(this.personForm.value.statisticEndDate);
    let end:number   = now.diff(end_m,'days');
    console.log(start,end);
    this.intEnd = end_m.format('yyyy-MM-DD');
    this.intStart = start_m.format('yyyy-MM-DD');
    this.statistic = false;
    this.requestStatistic(start,end);
  }



  editIndividual(person:LeadsReport) {
  
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
          this.ServerApiService.fetchPersonByPersonID(str)
          .subscribe((persons:Person[])=>{ 
            str = sessionStorage.getItem('leads');
            this.leads = JSON.parse(str);
            str = sessionStorage.getItem('persons');
            this.persons = JSON.parse(str);
            str = sessionStorage.getItem('actions');
            this.actions = JSON.parse(str);
            this.persons.push(persons[0]);
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

