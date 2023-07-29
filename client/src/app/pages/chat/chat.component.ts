import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chats: string[] = [];
  constructor(private websocketService: WebsocketService) {}
  sendSomething() {
    this.websocketService.sendChatMessage(this.control.value ?? '');
  }
  control = new FormControl('');
  ngOnInit(): void {
    this.websocketService.message$.subscribe((event) => {
      this.chats.push(event.data);
    });
  }

  year = 2022;
  month = 7;
  day = 30;
  hours = 15;
  minits = 30

  time = `${this.year}/${this.month}/${this.day} ${this.hours}:${this.minits}`;
  onSubmit(event:SubmitEvent){
    event.preventDefault();
    console.log("aiueo");
  }
}

