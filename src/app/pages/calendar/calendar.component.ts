import { Component,OnInit, HostListener } from '@angular/core';
import * as moment from 'moment';

declare interface CalendarData {
    code: number
    locationId: number
    sessionDate: string
    sessionEndDate: string
    sessionNum: number
    sessionType: number
    teacher: string
  }

declare interface Day {
    day: string
    thisMonthDay: boolean
    today?: boolean
  }

@Component({
    moduleId: module.id,
    selector: 'calendar-cmp',
    templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit {

    mobile:boolean;

    calendarObj:CalendarData[] =  [{"code":472,"sessionNum":1,"locationId":0,"sessionType":1,"sessionDate":"2019-05-28T15:00:00.000Z","sessionEndDate":"2019-05-28T19:00:00.000Z","teacher":"סתיו"},{"code":376,"sessionNum":11,"locationId":2,"sessionType":1,"sessionDate":"2019-12-02T16:00:00.000Z","sessionEndDate":"2019-12-02T20:00:00.000Z","teacher":"Shmuel"},{"code":376,"sessionNum":12,"locationId":2,"sessionType":1,"sessionDate":"2019-12-09T16:00:00.000Z","sessionEndDate":"2019-12-09T20:00:00.000Z","teacher":"Shmuel"}];
    
    datetime:moment.Moment = moment();

    wk: Day[][] = [
      [{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false}],
      [{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false}],
      [{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false}],
      [{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false}],
      [{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false}],
      [{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false},{day:'',thisMonthDay:false,today:false}],
    ]

    calMonth = ''
    
    render() {
      let datetime = this.datetime.clone(),
      month = datetime.month();
      datetime.startOf('month').startOf('week');
      this.calMonth = this.datetime.format('MMMM YYYY')
      let week = 0, i;
      while (week < 6) {
        for (i = 0; i < 7; i++) {
          this.wk[week][i].day = '' + datetime.format('D')
          //checking if day of the current month
          if (month !== datetime.month()) {
            this.wk[week][i].thisMonthDay = false
          } else {
            this.wk[week][i].thisMonthDay = true
          }
          //checking today
          let curDate = moment();
          if (datetime.format('MM DD') == curDate.format('MM DD')) {
            this.wk[week][i].today = true
          }
          //checking in Student data possible course
          for (let k=0; k<this.calendarObj.length; k++) {
            if (this.calendarObj[k].sessionDate.slice(0, 10) == datetime.format('YYYY-MM-DD')) {
              this.wk[week][i].day  += ' ' + this.calendarObj[k].code + ' ' + this.calendarObj[k].teacher;
              break;
            }
          }
          datetime.add(1, 'day');
        }
        //end week
        week++;
      }
    }
    
    prevMonth () {
      this.datetime.startOf('month').subtract(1, 'day');
      this.render();
    }

    nextMonth () {
      this.datetime.endOf('month').add(1, 'day');
      this.render();
    }

    currMonth () {
      this.datetime = moment();
      this.render();
    }
    
    constructor() {}
    
    mediaCheck() {
      if (document.body.offsetWidth < 670) { 
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    }
    
    @HostListener("window:resize", [])
    onResize() {
      this.mediaCheck();
    }
    
    ngOnInit() {
      
        this.mediaCheck();
        this.calendarObj.sort(function (a, b) {
            if (a.sessionDate > b.sessionDate) {
                return 1;
            }
            if (a.sessionDate < b.sessionDate) {
                return -1;
            }
            return 0;
        });
        this.render()
    }
}
