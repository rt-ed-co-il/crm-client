import { Component } from '@angular/core';
import * as _ from "underscore";
import { ModalService } from '../../modal/modal.service';
import { ProductGroup, Product, Action, User, UsersData } from 'app/app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ThisDayDirective } from 'app/directives/thisday.directive';

@Component({
  selector: 'statistic-cmp',
  moduleId: module.id,
  templateUrl: 'statistic.component.html',
}) 

export class StatisticComponent { 
  personForm;
  actions:  Action[] =  [];
  statistics: any[] = [];
  users:    UsersData[] =    [];

  constructor(
    //private formBuilder: FormBuilder,
    private modalService: ModalService,
  ) {
    let str = sessionStorage.getItem("actions");
    this.actions = JSON.parse(str);
    str = sessionStorage.getItem("users");
    this.users = JSON.parse(str);

    this.personForm = new FormGroup({
      statisticDate: new FormControl(new Date()),
    });
  }
  // modal window
  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  showStatistic() {
    this.statistics = [];
    let dd:string = this.personForm.value.statisticDate;
    let act:Action[] = _.filter(this.actions, function(d){ 
      return new Date(d.create_date).getDate() === new Date(dd).getDate()
    });
    let stat:any =  _.countBy(act, "create_user_id");
    for (let key in stat) {
      let n:UsersData = _.findWhere(this.users,{rtuser:key});
      let name = '';
      if (n !== undefined) {
        name = n.first_name + ' ' + n.last_name
      }
      let statistic = {
        user:key,
        name: name,
        actions: stat[key]
      };
      this.statistics.push(statistic);
    }
    this.openModal('custom-modal-22');
  }
}
