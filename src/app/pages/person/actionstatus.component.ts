import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'action-status',
  templateUrl: 'actionstatus.component.html'
})
export class ActionStatusComponent implements OnInit {
  @Input() actionStatus: string;
  constructor() { }
  ngOnInit() {}
}