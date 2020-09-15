import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'app/app.component';
//import { DatePipe } from '@angular/common';
import { ChatService } from '../../servises/chat.service';
//import * as moment from 'moment';

//  RUN FIRST npm install rxjs-compat
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/throttleTime';

@Component({
  selector: 'chat-cmp',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [
    ChatService,
  ]
})
export class ChatComponent implements OnInit {
  message_text: string;
  message: ChatMessage;
  messages: ChatMessage[] = [];
  user_name = '';
  user = '';

  constructor(
//    private datePipe: DatePipe,
    private chatService: ChatService,
  ) { 
    this.user = sessionStorage.getItem('rtuser');
    this.user_name = sessionStorage.getItem('first_name')+' '+sessionStorage.getItem('last_name');
  }
  selectMessage(message) {
    this.message = message;
  }
  sendMessage() {
    let message = 
    {
      _id: null,
      mess: this.message_text,
      ticket: this.message.ticket,
      student: this.message.student,
      date: new Date(), 
      cat: 'manager', //'manager', 'instructor', 'sales', 'marketing','student'
      name: this.user_name,
      id: this.user,
      sock:   null,
    }
    this.chatService.sendMessage(message);
    this.message_text = '';
  }
  ngOnInit() {
    this.chatService.requestHistory(null);

    this.chatService.getHistory()
    .subscribe((messages: ChatMessage[]) => {
       for (let i=0; i<messages.length; i++) {
        console.log(messages[i]);
        this.messages.push(messages[i]);
       }
       
     });
    
    this.chatService
    .getMessages()
  // .distinctUntilChanged()
  // .filter((message) => message.trim().length > 0)
  // .throttleTime(1000)
  // .takeWhile((message) => message !== this.endConversationCode) 
  // .skipWhile((message) => message !== this.secretCode)
  // .scan((acc: string, message: string, index: number) =>
  //     `${message}(${index + 1})`
  //   , 1)
   .subscribe((message: ChatMessage) => {
    console.log(message);
     //const currentTime = moment().format('hh:mm:ss a');
     //const messageWithTimestamp = `${currentTime}: ${message}`;
     this.messages.unshift(message);
   });

  }
}
