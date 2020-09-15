import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from "underscore";
import { ServerApiService } from '../../servises/server-api.service';
import { StatisticRecord, StatisticTable, StatisticTotal, LastEntries, Person, Action, Lead, DatesRequest } from 'app/app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalService } from 'app/modal/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit{
  personForm;
  statistic:      boolean = false;
  stat_record:    StatisticRecord;
  stat_table:     StatisticTable[] = [];
  contract_amount:number = 0;
  branch:         boolean = false;
  persons:        Person[] = [];
  leads:          Lead[]=[];
  actions:        Action[]=[];
  datesRequest:   DatesRequest;

  constructor(
    private ServerApiService: ServerApiService,
    private modalService: ModalService,
    private router: Router,
  ) {
    let str = sessionStorage.getItem('dates_request');
    if (str==='login') {
      this.datesRequest = {
        intEndDate: moment().format('yyyy-MM-DD'),
        intStartDate: moment().add(-30, 'days').format('yyyy-MM-DD'),
        intEndTime: '23:59:00',
        intStartTime: '00:00:00',
      }
    } else {
      this.datesRequest = JSON.parse(str);
    }
    this.personForm = new FormGroup({
      statisticStartDate: new FormControl(this.datesRequest.intStartDate),
      statisticEndDate: new FormControl(this.datesRequest.intEndDate),
      statisticStartTime: new FormControl(this.datesRequest.intStartTime),
      statisticEndTime: new FormControl(this.datesRequest.intEndTime),
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
      //this.requestStatistic(30,0);
      this.showStatistic();
    }
  }

  showStatistic() {
    let startDateTime :string = '';
    let endDateTime   :string = '';
    this.datesRequest.intStartDate = this.personForm.value.statisticStartDate;
    this.datesRequest.intStartTime = this.personForm.value.statisticStartTime;
    this.datesRequest.intEndDate = this.personForm.value.statisticEndDate;
    this.datesRequest.intEndTime = this.personForm.value.statisticEndTime;
    let strData = JSON.stringify(this.datesRequest);
    sessionStorage.setItem('dates_request',strData);
    startDateTime = this.personForm.value.statisticStartDate + ' ' + this.personForm.value.statisticStartTime;
    endDateTime = this.personForm.value.statisticEndDate + ' ' + this.personForm.value.statisticEndTime;
    this.statistic = false;
    let statReqesr = {
      dates: {
        startDateTime: startDateTime,
        endDateTime: endDateTime,
      }
    }
    strData = JSON.stringify(statReqesr);
    this.ServerApiService.fetchReportInterval(strData)
    .subscribe((data:StatisticRecord)=>{
      this.stat_record = data;
      this.contract_amount = this.stat_record.con.con_table.reduce((s, f) => {
        return s + (+f.amount);
      }, 0);      
      this.statistic = true;
    }, (error) => {
      console.log(error);
    });
  }

  showPersons(type:string,filter:string,stat:StatisticTotal) {
    let table:StatisticTable[] = [];
    this.stat_table = [];
    if (type==='lid') {
      table = this.stat_record.lid.lid_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      }
    } else if (type==='tas') {
      table = this.stat_record.tas.tas_table;
      if (filter==='user') {
        this.stat_table = _.where(table, {create_user_id:stat.data });
      }
    } else if (type==='app') {
      table = this.stat_record.app.app_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      } else if (filter==='user') {
        this.stat_table = _.where(table, {user_id:stat.data });
      } else if (filter==='status') {
        this.stat_table = _.where(table, {status:stat.data });
      }
    } else if (type==='con') {
      table = this.stat_record.con.con_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      } else if (filter==='user') {
        this.stat_table = _.where(table, {create_user_id:stat.data });
      }
    } else if (type==='not') {
      table = this.stat_record.not.not_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      } 
    }
    this.openModal('custom-modal-101');
  }

  editIndividual(person:StatisticTable) {
    this.closeModal('custom-modal-101');
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

