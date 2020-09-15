import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from "underscore";
import { Lead, Person, LastEntries, Product, Branches, ProductGroup, } from 'app/app.component';
import { Router } from '@angular/router';
import { ServerApiService } from 'app/servises/server-api.service';
import { ModalService } from '../../modal/modal.service';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'person-cmp',
    moduleId: module.id,
    templateUrl: 'person.component.html',
    styleUrls: ['person.component.css'],
    providers: [ServerApiService]
}) 
 
export class PersonComponent implements OnInit{
    personForm;
    submitted = false;
    ifTest = false;
    ifCV = false;
    test = 'testText';
    cv = 'cv;'
    product_groups:ProductGroup[] = [];
    products_all:Product[] = []; 
    products :Product[] = [];
    singleCourse:boolean = false;
    lead:Lead;
    leads:Lead[] = [];
    person:Person;
    persons:Person[] = [];
    lastEntrie: LastEntries;
    nc:any;
    //individuals:Individual[]=[];
    PersonError:string;
    PersonErrorText:string;
    branches = Branches;

    constructor(
      private router: Router,
      private modalService: ModalService,
      private toastr: ToastrService,
      private ServerApiService: ServerApiService ) 
    {
      let str:string;
      str = sessionStorage.getItem("productgroup");
      this.product_groups = JSON.parse(str);
      str = sessionStorage.getItem("product");
      this.products_all = JSON.parse(str);
      this.products = JSON.parse(str);
      str = sessionStorage.getItem("individual2edit");
      this.lastEntrie = JSON.parse(str);
      str = sessionStorage.getItem('leads');
      this.leads = JSON.parse(str);
      this.lead = _.findWhere(this.leads, {person_id: this.lastEntrie.person_id});
      str = sessionStorage.getItem('persons');
      this.persons = JSON.parse(str);
      this.person = _.findWhere(this.persons, {person_id: this.lastEntrie.person_id});
      this.nc= +this.person.no_call; 
      let dd = new Date(this.lead.entry_timestamp).toLocaleString();
      if (+this.lead.product_id===6) {this.singleCourse = true;}

      this.personForm = new FormGroup({
        person_id:        new FormControl(this.person.person_id),
        first_name:       new FormControl(this.person.first_name),
        last_name:        new FormControl(this.person.last_name),
        email:            new FormControl(this.person.email, Validators.email),
        phone_1:          new FormControl(this.person.phone_1),
        phone_2:          new FormControl(this.person.phone_2),
        address:          new FormControl(this.person.address),
        country_id:       new FormControl(this.person.country_id),
        no_call:          new FormControl(this.nc),
        lead_id:          new FormControl(this.lead.lead_id),
        entry_timestamp:  new FormControl(dd),
        source:           new FormControl(this.lead.source),
        source_details:   new FormControl(this.lead.source_details),
        product_group_id: new FormControl(this.lead.product_id,Validators.required),
        product_id:       new FormControl(this.lead.product_single_id,Validators.required),
        branch_id:        new FormControl(this.lead.branch_id,Validators.required),
      });
    }
    ngOnInit() {
      //if (this.lead.cv_text !== null || this.lead.cv_text != '') {
      if (this.lead.cv_text) {
        this.cv = this.lead.cv_text;
        this.ifCV = true;
      }
      let entryData2Server = { 
        entry_id: this.person.entry_id
      }
      //console.log(this.person.entry_id)
      let str = JSON.stringify(entryData2Server);
      this.ServerApiService.fetchIndividualByEntyID(str)
      .subscribe((data)=>{
        
        if (data == 0) { 
          console.log('Error entryID:', this.person.entry_id);
        } else if (data[0].testText) { 
        //if (data[0].testText !== null || data[0].testText != '') {
          this.test = data[0].testText;
          this.ifTest = true;
        }
      }, (error) => {
        console.log(error);
      });
    }
    //FORM FIELDS
    // convenience getter for easy access to form fields
    get f() { return this.personForm.controls; }
    ChangingProductGroup(prod_group) {
      if (+prod_group.target.value===6) {
        this.singleCourse = true;
      } else {
        this.singleCourse = false;
      }
      this.products = _.where(this.products_all, {
        product_group_id: +prod_group.target.value
      });
    }
    ChangingValue(e) {}
    onSubmit(personData) {
      this.submitted = true;
      // stop here if form is invalid
      if (this.personForm.invalid) {
        return;
      }
      // Process checkout data here
        let personData2Server = {
          person: {
          person_id:        this.person.person_id,
          first_name:       personData.first_name,
          last_name:        personData.last_name,
          email:            personData.email,
          phone_1:          personData.phone_1,
          phone_2:          personData.phone_2,
          address:          personData.address,
          country_id:       personData.country_id,
          no_call:          personData.no_call,
          }
        }
        let leadData2Server = {
          lead:{
          lead_id:            this.lead.lead_id,
          entry_timestamp:    this.lead.entry_timestamp,
          source:             this.lead.source,
          source_details:     personData.source_details,
          product_id:         personData.product_group_id,
          product_single_id:  personData.product_id,
          branch_id:          personData.branch_id,
          }
      }
      let strData = JSON.stringify(personData2Server);
      this.ServerApiService.fetchPersonUpdate(strData)
      .subscribe((data:number)=>{
        this.PersonError = '';
        this.person.first_name  = personData.first_name;
        this.person.last_name   = personData.last_name;
        this.person.email       = personData.email;
        this.person.phone_1     = personData.phone_1;
        this.person.phone_2     = personData.phone_2;
        this.person.address     = personData.address;
        this.person.country_id  = personData.country_id;
        this.person.no_call     = personData.no_call;
        let str:string = JSON.stringify(this.persons);
        sessionStorage.setItem('persons',str);
        // call leads
        let strData = JSON.stringify(leadData2Server);
        this.ServerApiService.fetchLeadUpdate(strData)
        .subscribe((data:number)=>{
          this.lead.source_details =   personData.source_details;
          this.lead.product_id =       personData.product_group_id;
          this.lead.product_single_id= personData.product_id;
          this.lead.branch_id =        personData.branch_id;
          str = JSON.stringify(this.leads);
          sessionStorage.setItem('leads',str);

          this.toastr.success(
            '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Person Updated</span>',
            "",
            {
              timeOut: 1000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-success alert-with-icon",
              positionClass: "toast-top-center"
            }
          );

          //this.backToPrewPage();
        }, (error) => {
          console.log(error);
          this.PersonError = "Users error :" + error.status;
          this.PersonErrorText = error.error.reason;
        });
      }, (error) => {
        console.log(error);
        this.PersonError = "Users error :" + error.status;
        this.PersonErrorText = error.error.reason;
      });
    }
    cancel() {
      this.backToPrewPage();
    }
    backToPrewPage() {
      let prevPage:string = sessionStorage.getItem('prev_page_user');
      this.router.navigate(['/'+prevPage]);
    }
    // modal window
    openModal(id: string) {
      this.modalService.open(id);
    }
    closeModal(id: string) {
      this.modalService.close(id);
    }
}