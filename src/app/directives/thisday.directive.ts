import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import * as moment from 'moment';

@Directive({
  selector: '[thisDayCheck]'
})

export class ThisDayDirective {
  @Input() day:Date

  constructor(private el: ElementRef, private ren: Renderer2) { }
  
  ngOnInit() {
    let day:moment.Moment = moment(this.day);
    let now:moment.Moment = moment();
    let diff = +now.diff(day, 'days');
    if (diff==0) {
      this.ren.setStyle(this.el.nativeElement, 'color', '#5cb85c')
    } else if (diff<0) {
      this.ren.setStyle(this.el.nativeElement, 'color', '#0275d8')
    } else if (diff==1) {
      this.ren.setStyle(this.el.nativeElement, 'color', '#f0ad4e')
    } else if (diff>1 && diff<=10) {
      this.ren.setStyle(this.el.nativeElement, 'color', '#d9534f')
    } else {
      this.ren.setStyle(this.el.nativeElement, 'color', '#292b2c')
    }
  }

}
