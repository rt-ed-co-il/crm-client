import { Component, OnInit, OnChanges } from '@angular/core';
import { Action, LastEntries, Branches, Product, Lead, Person, Con, ProductGroup, SERV, PORT } from 'app/app.component';
import { ServerApiService } from 'app/servises/server-api.service';
import { Router } from '@angular/router';
import * as _ from "underscore";
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from "ngx-toastr";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ModalService } from '../../modal/modal.service';



@Component({
  selector: 'contract-new-cmp',
  moduleId: module.id,
  templateUrl: 'contractnew.component.html',
  styleUrls: ['actionnew.component.css'],
  providers: [ServerApiService]
}) 

export class ContractNewComponent implements OnInit, OnChanges{
  courses :Product[]=[];
  contract_courses :Product[]=[];
  single_courses :Product[]=[];
  create_date: Date = new Date();
  submitted = false;
  action:Action;
  actions:Action[]=[];
  lead:Lead;
  leads:Lead[] = [];
  person:Person;
  persons:Person[] = [];
  lastEntrie: LastEntries;
  branches = Branches;
  rtuser:number;
  action_user:string = '';
  ActionError:String = '';
  ActionErrorText:String = '';
  con: Con;
  contract: Con[] =[];
  contract_product ='';
  amount = 0;
  start_date = '';
  //url: string = '';
  urlSafe = '';//SafeResourceUrl;

  constructor(
    public sanitizer: DomSanitizer, 
    private modalService: ModalService,
    private ServerApiService: ServerApiService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private router: Router
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
    this.rtuser = +sessionStorage.getItem("rtuser");
    this.action_user = sessionStorage.getItem("first_name")+' '+sessionStorage.getItem("last_name");
    this.start_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //PRODUCT
    str = sessionStorage.getItem("product");
    this.courses = JSON.parse(str);
    this.contract_courses = 
    _.where(this.courses,{product_group_id: +this.lead.product_id});
    this.amount = this.contract_courses[0].product_group_amount;
    this.contract_product = this.contract_courses[0].product_group_description;
    this.single_courses= 
    _.where(this.courses,{product_group_id: 6 });
  }

  ngOnInit() { }
  ngOnChanges() { }
  // modal window
  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  // First Button
  // send contrct to rendering
  renderContract(f: NgForm) {
    this.createObject(f);
    let contractData2Server = {
      contract: {
        contract_id:      null,
        create_date:      this.create_date,
        start_date:       new Date(f.value.start_date), /// start course
        first_name:       this.person.first_name,
        last_name:        this.person.last_name,
        phone_1:          this.person.phone_1,
        email:            this.person.email,
        address:          this.person.address,
        country_id:       this.person.country_id,
        branch_id:        this.lead.branch_id,
        user:             this.action_user,
        amount:           f.value.amount,
      },
      courses:  this.contract 
    }
    let strData = JSON.stringify(contractData2Server);
    this.ServerApiService.fetchNewContract(strData)
    .subscribe((data)=>{
      console.log(data);
      this.toastr.success(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Contract Created</span>',
        "",
        {
          timeOut: 3000,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-success alert-with-icon",
          positionClass: "toast-top-center"
        }
      );
      
      let previewUrl = 'http://'+SERV+':'+PORT+'/files/'+
      this.person.country_id+'/contr_'+this.person.country_id+'.docx';
      console.log(previewUrl)
      //let url = 'https://docs.google.com/gview?url='+previewUrl+'&embedded=true';
      this.urlSafe= previewUrl;
      //this.sanitizer.bypassSecurityTrustResourceUrl();
      this.openModal('custom-modal-7');  
      
    }, (error) => {
      this.ActionError = "Users error :" + error.status;
      this.ActionErrorText = error.error.reason;
    });
  }
  //
  saveAction(f: NgForm) {
    this.createObject(f);
    this.submitted = true;
    let actionData2Server = {
      action: {
        action_id:        null,
        b_task_id:        0,
        b_client_id:      0,
        type:             'Proposal',
        amount:           f.value.amount,
        message:          this.contract_product+' '+ f.value.amount + ' ' + f.value.start_date,
        subject:          'contract',
        user_id:          this.rtuser,
        create_user_id:   this.rtuser,
        update_user_id:   0,
        status:           'new',
        create_date:      this.create_date,
        start_date:       new Date(f.value.start_date), /// start course
        due_date:         null,
        update_date:      null,
        priority:         'normal',
        location:         ''+this.lead.branch_id,
        person_id:        this.lastEntrie.person_id,
      }
    } 
    let studentData2Server = {
      user: {
        studentID:        this.person.country_id, 
        firstName:        this.person.first_name, 
        familyName:       this.person.last_name, 
        address:          this.person.address, 
        email:            this.person.email, 
        mobileNumber:     this.person.phone_1,
        idImage:          null, 
        status:           5 , //CRM
        secondMobileNumber: this.person.phone_2, 
        registeryDate:    this.create_date,
        password:         this.person.country_id, 
        username:         this.person.email, 
        role:             1, //student
        theme:            1, //default
        paymentMethodsCode: null,
        location:         this.lead.branch_id-100,
        amount:           f.value.amount,
      },
      courses:  this.contract 
    }

    let leadData2Server = {
      lead:{
      lead_id:            this.lead.lead_id,
      entry_timestamp:    this.lead.entry_timestamp,
      source:             this.lead.source,
      source_details:     this.lead.source_details,
      product_id:         this.lead.product_id,
      product_single_id:  this.lead.product_single_id,
      branch_id:          this.lead.branch_id,
      status:             'Student',
      }
    }

    let strData = JSON.stringify(actionData2Server);
    this.ServerApiService.fetchNewAction(strData)
    .subscribe((data:number)=>{
      this.ActionError = '';
      // push to array
      actionData2Server.action.action_id = data[0];
      let str = sessionStorage.getItem('actions');
      this.actions = JSON.parse(str);
      //this.actions.push(actionData2Server.action);
      this.actions.unshift(actionData2Server.action);
      str = JSON.stringify(this.actions);
      sessionStorage.setItem('actions',str);
      let strData = JSON.stringify(leadData2Server);
      this.ServerApiService.fetchLeadUpdate(strData)
      .subscribe((data:number)=>{
        this.lead.status = "Student";
        str = JSON.stringify(this.leads);
        sessionStorage.setItem('leads',str);
        // Student new 
        strData = JSON.stringify(studentData2Server);
        this.ServerApiService.fetchNewStudent(strData)
        .subscribe((data)=>{

          this.toastr.success(
            '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">New Student Created</span>',
            "",
            {
              timeOut: 3000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-success alert-with-icon",
              positionClass: "toast-top-center"
            }
          );
        //this.router.navigate(['/person']);
        }, (error) => {
          this.ActionError = "Users error :" + error.status;
          this.ActionErrorText = error.error.reason;
        });
      }, (error) => {
        this.ActionError = "Users error :" + error.status;
        this.ActionErrorText = error.error.reason;
      });
    }, (error) => {
      this.ActionError = "Users error :" + error.status;
      this.ActionErrorText = error.error.reason;
    });
    
  }

  cancel() {
    this.router.navigate(['/person']);
  }

  createObject(f: NgForm) {
    this.contract = [];
    for (const key of Object.keys(f.value)) {
      if (key[0]=='c' || key[0]=='d') {
        if (f.value[key]) {
          //console.log(key,":",f.value[key]);
          let c = key.substring(1,key.length);
          this.con = {
            product_id:+c,
            description: _.findWhere(this.courses,{product_id: +c}).description,
            amount:0
          }
          this.contract.push(this.con);
        }
      }
      if (key[0]=='p' || key[0]=='v') {
        let c = key.substring(1,key.length);
        let con:Con = _.findWhere(this.contract,{ product_id: +c });
        if (con) {
          con.amount = + f.value[key];
        }
      }
    }
  }
}