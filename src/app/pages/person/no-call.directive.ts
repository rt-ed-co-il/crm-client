import { Directive, Input, ElementRef, Renderer2, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[noCallDir]'
})
export class NoCallDirective {

  @Input()  noCallIn:boolean
  @Output() noCallOut:boolean


  constructor(private el: ElementRef, private ren: Renderer2) { }

  @HostListener('click',['$event']) onClick(event: Event) {
    console.log(event.target)
    
  }


  @HostListener('mouseenter',['$event']) onMouseEnter(event: Event) {
    console.log(event.target)
  }
 
  ngOnChanges() {
    //console.log('on changes')

    //this.ren.setStyle(this.el.nativeElement, 'color', 'gray')
    console.log(this.ren);
    console.log(this.el.nativeElement);
    //this.ren.setStyle(this.el.nativeElement, 'color', 'red')
  }

}
