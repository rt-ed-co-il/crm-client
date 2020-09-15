import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from "underscore";
import { Action, Lead, Person, Product, Branches, ProductGroup } from 'app/app.component';
import { Router } from '@angular/router';
import { ServerApiService } from 'app/servises/server-api.service';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'person-new-cmp',
    moduleId: module.id,
    templateUrl: 'personnew.component.html',
    styleUrls: ['personnew.component.css'],
    providers: [ServerApiService]
}) 
 
export class PersonNewComponent {
    individualForm;
    submitted = false;
    product_groups:ProductGroup[]=[];
    products_all:Product[]=[]; 
    products :Product[]=[];
    singleCourse:boolean = false;
    lead:Lead;
    leads:Lead[] = [];
    person:Person;
    persons:Person[] = [];
    action:Action;
    actions:Action[] = [];
    nc = 0;
    branches = Branches;
    branch = false;
    PersonError:string;
    PersonErrorText:string;
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private toastr: ToastrService,
      private ServerApiService: ServerApiService 
    ) 
    {
      let role = sessionStorage.getItem('role');
      if (role==='branch') this.branch = true;
      let str:string;
      str = sessionStorage.getItem("productgroup");
      this.product_groups = JSON.parse(str);
      str = sessionStorage.getItem("product");
      this.products_all = JSON.parse(str);
      this.products = JSON.parse(str);
      let date = new Date();
      let create_user_id:number = +sessionStorage.getItem("rtuser");
      this.individualForm = this.formBuilder.group({
        //person
        person_id:        0,
        first_name:       ['', [Validators.required]],
        last_name:        '',
        email:            '',
        phone_1:          ['', [Validators.required]],
        phone_2:          '',
        address:          '',
        country_id:       '',
        no_call:          0,
        //lead
        lead_id:          0,
        entry_timestamp:  date,
        source:           'SEO',
        source_details:   'ידני',
        product_group_id: 0, 
        product_id:       0,
        branch_id:        200,  
        cv_file:          '',
        cv_text:          '',
        //action
        action_id:0,
        type: 'LID',
        amount: 0,
        message: 'new lead',
        subject: '',
        user_id: create_user_id,
        create_user_id: create_user_id,
        status: 'new',
        create_date: date,
        start_date: null,
        due_date: null,
        update_date: null,
        priority: 'normal',
        location: 100
      });
    }

    //FORM FIELDS
    // convenience getter for easy access to form fields
    get f() { return this.individualForm.controls; }
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
    ////////////////////
    ///
    onSubmit(personData) {
      let notExist = true;
      // stop here if form is invalid
      if (this.individualForm.invalid) {
        return;
      }
      // stop if phone_1 or email exist
      //personData.phone_1
      //personData.email
      let strData2Server = { 
        in_value: personData.phone_1
      }
      let strData = JSON.stringify(strData2Server);
      this.ServerApiService.fetchPersonsByString(strData)
      .subscribe((persons)=>{
        if (persons !== 0) {
          notExist = false;
          
          this.toastr.error(
            '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Phone number exist</span>',
            "",
            {
              timeOut: 4000,
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-danger alert-with-icon",
              positionClass: "toast-top-center"
            }
          );
        } else {

            let personData2Server = {
              person: {
                person_id:        null,
                first_name:       personData.first_name,
                last_name:        personData.last_name,
                email:            personData.email,
                phone_1:          personData.phone_1,
                phone_2:          personData.phone_2,
                address:          personData.address,
                country_id:       personData.country_id,
                no_call:          personData.no_call,
                entry_id:         0,
                b_client_id:      0
              }
            }
            let leadData2Server = {
              lead:{
                lead_id:          null,
                entry_timestamp:  new Date(),
                first_name:       personData.first_name,
                last_name:        personData.last_name,
                phone_1:          personData.phone_1,
                email:            personData.email,
                source:           'SEO',
                status:           'New',
                source_details:   personData.source_details,
                product_id:       personData.product_group_id,
                product_single_id: personData.product_id,
                person_id:        null,
                branch_id:        personData.branch_id,
                cv_file:          '',
                cv_text:          '',
              }
            }
            let create_user_id:number = +sessionStorage.getItem("rtuser");
            let actionData2Server = {
              action: {
                action_id:      null,
                b_task_id:      0,
                b_client_id:    0,
                type:           'LID',
                amount:         0,
                message:        'LID',
                subject:        'LID',
                user_id:        create_user_id,
                create_user_id: create_user_id,
                update_user_id: 0,
                status:         'new',
                create_date:    new Date(),
                start_date:     null,
                due_date:       null,
                update_date:    null,
                priority:       'normal',
                location:       '100',
                person_id:      null
              }
            }
            let individual2Server = {
              individual: {
                entryID:        0,
                EntryDate:      new Date(),
                NewEntryDate:   new Date(),
                FirstName:      personData.first_name,
                LastName:       personData.last_name,
                personID:       personData.country_id,
                Phone1:         personData.phone_1,
                Email:          personData.email,
                LastUpdate:     null,
                DateOfBirth:    null,
                Phone2:         personData.phone_2,
                City:           '',
                Address:        '',
                ContactType:    100,
                TaskOf:         500,
                addTask:        600,
                Meeting:        null,
                CV:             '',
                Complete:       0,
                addText:        '',
                training:       0,
                Activities:     0,
                addTask2:       700,
                meetAgree:      800,
                meetAgree2:     900,
                jobCommit:      'לא',
                "0us_1him":     0,
                file_path:      '',
                newsletter:     0,
                writeDate:      null,
                gender:         '',
                company_id:     0,
                allowed_sms:    1,
                relevant:       0,
                b_entryID:      0,
                location:       personData.branch_id,
                testText:       '',
              }
            }
            
            let mail_message = 
            '<p dir="rtl">שלום ' + personData.first_name + '</p>'+
            '<p dir="rtl">אנחנו במכללת Real Time, המכללה היחידה בארץ שהיא גם בית תוכנה שמחים מאוד שמעניין אותך לשמוע על לימודי '+ 
            //_.findWhere(this.products, {product_id: +personData.product_id }).description +'</p>'+
            '<p dir="rtl">המכללה מכשירה באופן מעשי מאות בוגרים בכל שנה למגוון תחומים בהייטק.</p>'+
            '<p dir="rtl">אחד מיועצי המכללה יחזור אליך בהקדם עם פרטים מלאים אודות תכניות ההכשרה ותשובות לכל השאלות.</p>'+
            '<p dir="rtl">בינתיים ניתן לצפות בסרטון הבא בשביל להכיר יותר טוב את צוות המכללה גם לשמוע את הבוגרים שלנו מספרים על החוויה שלהם ועל איך פיתחו קריירה בהייטק לאחר הלימודים.</p>'+
            '<p dir="rtl">Real Time College חטיבת ההדרכה של RT Group</p>'+
            '<p dir="rtl">טלפון: 077-7067057</p>'+
            '<p dir="rtl">אמייל: info@rt-ed.co.il</p>';
            let mailData2Server = {
              mail: { 
                first_name: personData.first_name,
                last_name: personData.last_name,
                email: personData.email,
                no_call: personData.no_call,
                entry_timestamp: new Date(),
                product_id: personData.product_group_id,
                branch_id: personData.branch_id,
                message: mail_message,
                subject: ' שלום ' + personData.first_name,
                user_id: create_user_id,
              }
            }
            let sms_message = 
            ' שלום ' + personData.first_name +
            ' אנחנו במכללת Real Time, המכללה היחידה בארץ שהיא גם בית תוכנה שמחים מאוד שמעניין אותך לשמוע על לימודי '+ 
            //_.findWhere(this.products, {product_id: + personData.product_id }).description +
            ' אחד מיועצי המכללה יחזור אליך בהקדם עם פרטים מלאים אודות תכניות ההכשרה ותשובות לכל השאלות. '+
            ' Real Time College חטיבת ההדרכה של RT Group '+
            ' טלפון:  077-7067057 '+
            ' אמייל: info@rt-ed.co.il ';
            let smsData2Server = {
              sms: { 
                first_name: personData.first_name,
                last_name: personData.last_name,
                phone_1: personData.phone_1,
                no_call: personData.no_call,
                entry_timestamp: new Date(),
                product_id: personData.product_group_id,
                branch_id: personData.branch_id,
                message: sms_message,
                subject:' שלום ' + personData.first_name,
                user_id: create_user_id,
              }
            }
            let str = JSON.stringify(individual2Server);
            this.ServerApiService.fetchIndividualNew(str)
            .subscribe((res)=>{
              console.log('individual',res);
              personData2Server.person.entry_id = res[0];
              let str = JSON.stringify(personData2Server);
              this.ServerApiService.fetchPersonNew(str)
              .subscribe((person_id:number)=>{
                this.PersonError = '';
                personData2Server.person.person_id = person_id[0];
                leadData2Server.lead.person_id = person_id[0];
                actionData2Server.action.person_id = person_id[0];
                str = sessionStorage.getItem('persons');
                this.persons = JSON.parse(str);
                this.persons.push(personData2Server.person);
                str = JSON.stringify(this.persons);
                sessionStorage.setItem('persons',str);
                // call leads
                str = JSON.stringify(leadData2Server);
                this.ServerApiService.fetchLeadNew(str)
                .subscribe((lead_id:number)=>{
                  leadData2Server.lead.lead_id = lead_id[0];
                  str = sessionStorage.getItem('leads');
                  this.leads = JSON.parse(str);
                  this.leads.push(leadData2Server.lead);
                  str = JSON.stringify(this.leads);
                  sessionStorage.setItem('leads',str);
                  str = JSON.stringify(actionData2Server);
                  this.ServerApiService.fetchNewAction(str)
                  .subscribe((action_id:number)=>{
                    actionData2Server.action.action_id = action_id[0];
                    str = sessionStorage.getItem('actions');
                    this.actions = JSON.parse(str);
                    //this.actions.push(actionData2Server.action);
                    this.actions.unshift(actionData2Server.action);
                    str = JSON.stringify(this.actions);
                    sessionStorage.setItem('actions',str);
                    this.toastr.success(
                      '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Person Saved</span>',
                      "",
                      {
                        timeOut: 1000,
                        closeButton: true,
                        enableHtml: true,
                        toastClass: "alert alert-success alert-with-icon",
                        positionClass: "toast-top-center"
                      }
                    );
                    if ( personData.no_call == 9) {
                      str = JSON.stringify(mailData2Server);
                      this.ServerApiService.fetchMailText(str)
                      .subscribe((res)=>{
                        str = JSON.stringify(smsData2Server);
                        this.ServerApiService.fetchSMSText(str)
                        .subscribe((res)=>{
      
                          //this.router.navigate(['/persons']);
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
                    } else {
                    //  this.router.navigate(['/persons']);
                    }
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
        
          /*  */
    
        }
      }, (error) => {
        console.log(error);
        notExist = false;
      }); 
      /* if email added please check
      if (personData.email.trim()) {
        strData2Server = { 
          in_value: personData.email
        }
        strData = JSON.stringify(strData2Server);
        this.ServerApiService.fetchPersonsByString(strData)
        .subscribe((persons)=>{
          if (persons !== 0) {
            notExist = false;
            console.log(persons);
            this.toastr.error(
              '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Email exist</span>',
              "",
              {
                timeOut: 4000,
                closeButton: true,
                enableHtml: true,
                toastClass: "alert alert-danger alert-with-icon",
                positionClass: "toast-top-center"
              }
            );
          }
        }, (error) => {
          console.log(error);
          notExist = false;
        });   
      }
      New person */
    }

    ///////////////
    // cancel
    cancel() {
      this.router.navigate(['/typography']);
    }
}