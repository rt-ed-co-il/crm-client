import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCalStyle]'
})
export class CalStyleDirective {

  @Input() thisMonthDay:boolean
  @Input() today:boolean

  constructor(private el: ElementRef, private ren: Renderer2) { }
  
  ngOnChanges() {
    //console.log('on changes')
    if (!this.thisMonthDay) {
      this.ren.setStyle(this.el.nativeElement, 'color', 'gray')
    } 
    if (this.today) {
      //this.ren.setStyle(this.el.nativeElement, 'color', 'red')
    } 
  }

}
