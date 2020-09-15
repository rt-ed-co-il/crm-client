import { Component, OnInit, SystemJsNgModuleLoaderConfig } from '@angular/core';
// AIzaSyDK2GB2N7oxa-lYvimWa2KzC0dDCIl_fD4
export const ImgPath: string    = "assets/img/usr/";
export const FilesPath: string  = "files/";
//
export const SERV: string     = '45.83.43.173'; 

//export const SERV: string     = '167.71.55.97'; 
//export const SERV: string       = 'localhost';
export const PORT: string       = '3000';
export const PORT_CLIENT: string  = '4300';

/* STUDENTS APPS */
export const ReqType = ['permit','practice','grade','viewrecord','freeze','other'];
export const AnsType = ['waiting','allowed','denied'];
export interface Ticket {
  ticket_id:      number,
  student_id:     string,
  req_type:       string, //'permit','practice','grade','viewrecord','freeze','other'
  req_reason:     string,
  req_date:       Date,
  admin_id:       string,
  ans_type:       string, //'waiting','allowed','denied'
  ans_reason:     string,
  ans_date:       Date,
  act_date:       Date,
  course_id:      number,
  path_id:        number,
  cycle_id:       number,
}

export interface ChatMessage {
  _id:              number,
  mess:             string,
  ticket:           number,
  student:          string,
  date:             Date, 
  cat:              string, 
  name:             string,
  id:               string,
  sock:             string,
}

export interface Student {
  studentID:            string, 
  firstName:            string, 
  familyName:           string, 
  address:              string, 
  email:                string, 
  mobileNumber:         string, 
  idImage:              string, 
  status:               number
  secondMobileNumber:   string, 
  registeryDate:        Date,
  username:             string, 
  password:             string, 
  role:                 number,
  theme:                number,
  paymentMethodsCode:   number,
  location:             number
}

/* User Data */
export interface User {
  user: {
    _id:            string,
    role:           string,
    category:       string,
    email:          string,
    token:          string,
    first_name:     string,
    last_name:      string, 
    rtuser:         string, 
    photo:          string,
    branch:         string
  }
}

export interface UsersData {
  _id:              string,
  first_name:       string,
  last_name:        string,
  category:         string,
  role:             string,
  branch:           string,
  phone:            string,
  photo:            string,
  address:          string,
  email:            string,
  rtuser:           string,
  hash?:            string,
  salt?:            string
}

/* RT Person Data */
export const ActionType       = ['Appointment','Task','SMS','Email','NotRelevant','Proposal','HR'];
export const ActionStatus     = ['completed','new','canceled'];
export const ActionsPriority  = ['normal','high'];
export const LeadSource       = ['INT','PPC','SEO','SNL','DEF'];
export const Branches = [
  {
    branch_id:    200,
    name:         'Tel-Aviv',
    addr:         'סניף תל אביב רח יגאל אלון 123'
  },
  {
    branch_id:    100,
    name:         'Rishon',
    addr:         'סניף ראשון לציון רח רוזנסקי 14'
  },
  {
    branch_id:    300,
    name:         'Haifa',
    addr:         'סניף חיפה רח ההסתדרות 80 קוד כניסה 4243'
  },
];

export interface ProductGroup {
  product_group_id:           number,
  description:                string,
  price:                      number,
  full_price:                 number,
  s_price:                    number,
  s_full_price:               number,
  payments_check:             number,
  payments_credit:            number
}

export interface Product {
  product_id:                 number,
  product_group_description:  string,
  product_group_amount:       number,
  product_group_id:           number,
  description:                string,
  hours:                      number,
  price:                      number,
  disc_price :                number,
  course_s_price  :           number,
  course_s_full_price  :      number,
  course_payment_check  :     number,
  course_payment_credit  :    number
}

export interface Contract {
  action_id:                  number,
  line_id:                    number,
  product_id:                 number,
  amount:                     number,
}

export interface Con {
  product_id:                 number,
  description:                string,
  amount:                     number,
}

export interface Action {
  action_id:                  number,
  b_task_id:                  number,
  b_client_id:                number,
  type:                       string,
  amount:                     number,
  message:                    string,
  subject:                    string,
  user_id:                    number,
  create_user_id:             number,
  update_user_id:             number,
  status:                     string,
  create_date:                Date,
  start_date:                 Date,
  due_date:                   Date,
  update_date:                Date,
  priority:                   string,
  location:                   string,
  person_id:                  number
}

export interface Person {
  person_id:                  number,
  first_name:                 string,
  last_name:                  string,
  email:                      string,
  phone_1:                    string,
  phone_2:                    string,
  address:                    string,
  country_id:                 string,
  no_call:                    number,
  entry_id:                   number,
  b_client_id:                number,
}

export interface Lead {
  lead_id:                    number,
  entry_timestamp:            Date,
  first_name:                 string,
  last_name:                  string,
  phone_1:                    string,
  email:                      string,
  status:                     string,
  source:                     string,
  source_details:             string,
  product_id:                 number,
  product_single_id:          number,
  branch_id:                  number,
  person_id:                  number,
  cv_file:                    string,
  cv_text:                    string
}

export interface LastEntries {
  person_id:                  number,
  first_name:                 string,
  last_name:                  string,
  email:                      string,
  phone_1:                    string,
  phone_2:                    string,
  address:                    string,
  country_id:                 string,
  no_call:                    number,
  lead_id:                    number,
  entry_timestamp:            Date,
  source:                     string,
  source_details:             string,
  product_id:                 number,
  product_single_id:          number,
  branch_id:                  number,
  status:                     string,
  cv_file:                    string,
  cv_text:                    string,
  last_action_id:             number,
  last_action_type:           string,
  last_action_message:        string,
  last_action_subject:        string,
  last_action_user_id:        number,
  last_action_create_user_id: number,
  last_action_update_user_id: number,
  last_action_create_date:    Date,
  last_action_start_date:     Date,
  last_action_due_date:       Date,
  last_action_update_date:    Date,
  last_action_status:         string,
}


///STATISTIC
export interface LeadsReport {
  amount: number,
  branch: number,
  create_date: Date,
  message: string,
  name: string,
  path: string,
  person_id: number,
  phone: string,
  source:string,
  start_date: Date,
  status: string,
  status_date: Date,
  type: string,
  actions: number,
}
export interface StatisticRecord {
  lid:{
    lid_table:    StatisticTable[],
    lid_total:    StatisticTotal[],
    lid_ppc:      StatisticTotal[],
    lid_snl:      StatisticTotal[],
    lid_seo:      StatisticTotal[],
  },
  app:{
    app_table:    StatisticTable[],
    app_status:   StatisticTotal[],
    app_user:     StatisticTotal[],
    app_source:   StatisticTotal[],
  },
  con:{
    con_table:    StatisticTable[],
    con_user:     StatisticTotal[],
    con_source:   StatisticTotal[],
  },
  not:{
    not_table:    StatisticTable[],
    not_source:   StatisticTotal[],
  },
  tas:{
    tas_table:StatisticTable[],
    tas_user:StatisticTotal[],
},

}
  
 export interface StatisticTable {
  lead_id:                    number,
  entry_timestamp:            Date,
  first_name:                 string,
  last_name:                  string,
  phone_1:                    string,
  email:                      string,
  status:                     string,
  source:                     string,
  source_details:             string,
  product_id:                 number,
  product_single_id:          number,
  branch_id:                  number,
  person_id:                  number,
  cv_file:                    string,
  cv_text:                    string,
  action_id:                  number,
  b_task_id:                  number,
  b_client_id:                number,
  type:                       string,
  amount:                     number,
  message:                    string,
  subject:                    string,
  user_id:                    number,
  create_user_id:             number,
  update_user_id:             number,
  status1:                    string,
  create_date:                Date,
  start_date:                 Date,
  due_date:                   Date,
  update_date:                Date,
  priority:                   string,
  location:                   string,
  person_id1:                 number
}

export interface StatisticTotal {
  data:                       string,
  total:                      number,
}

export interface Statistic {
  type:                       string,
  value:                      number,
  procent:                    number
}

/* Smart CV Data */
export interface Individual {
  entryID:                    number,
  EntryDate:                  Date,
  NewEntryDate:               Date,
  FirstName:                  string,
  LastName:                   string,
  personID:                   string,
  Phone1:                     string,
  Email:                      string,
  LastUpdate:                 Date,
  DateOfBirth:                string,
  Phone2:                     string,
  City:                       string,
  Address:                    string,
  ContactType:                number,
  TaskOf:                     number,
  addTask:                    number,
  Meeting:                    Date,
  CV:                         string,
  Complete:                   number,
  addText:                    string,
  training:                   number,
  Activities:                 number,
  addTask2:                   number,
  meetAgree:                  number,
  meetAgree2:                 number,
  jobCommit:                  string,
  "0us_1him":                 number,
  file_path:                  string,
  newsletter:                 number,
  writeDate:                  Date,
  gender:                     string,
  company_id:                 number,
  allowed_sms:                number,
  relevant:                   number,
  b_entryID:                  number,
  location:                   number,
  testText:                   string,
}
export interface Meetings {
  meetingsdate:               Date,
  meetApoint:                 Date,
  FirstName:                  string,
  Phone:                      string,
  Email:                      string
}
export interface DatesRequest {
  intEndDate:   string,
  intStartDate: string,
  intEndTime:   string,
  intStartTime: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  ngOnInit() {
  sessionStorage.clear();
  }
}
