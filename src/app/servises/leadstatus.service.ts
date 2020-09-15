
import { Injectable } from '@angular/core';
import { ServerApiService } from './server-api.service';
import { Lead } from 'app/app.component';
import * as _ from "underscore";

@Injectable({providedIn: 'root'})

export class LeadStatusService {
  leads:Lead[] =[];
  lead:Lead;
  constructor( private ServerApiService: ServerApiService) {}

  changeLidStatus (lead_person_id,lead_status,callback) {
    let str = sessionStorage.getItem('leads');
    this.leads = JSON.parse(str);
    this.lead = _.findWhere(this.leads,{person_id:lead_person_id});
    let leadData2Server = {
        lead:{
            lead_id:            this.lead.lead_id,
            entry_timestamp:    this.lead.entry_timestamp,
            source:             this.lead.source,
            source_details:     this.lead.source_details,
            product_id:         this.lead.product_id,
            product_single_id:  this.lead.product_single_id,
            branch_id:          this.lead.branch_id,
            status:             lead_status,
        }
    }
    let strData = JSON.stringify(leadData2Server);
    this.ServerApiService.fetchLeadUpdate(strData)
    .subscribe((data:number)=>{
        this.lead.status = lead_status;
        str = JSON.stringify(this.leads);
        sessionStorage.setItem('leads',str);
        callback(true) ;
    }, (error) => {
        console.log("Errore updating LID",error);
        callback(false);
    });
  }

}

