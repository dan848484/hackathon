import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WebsocketService } from 'src/app/services/websocket.service';
import {
  ChatMessage,
  OpenaiMessage,
  SuggestedScheduleMessage,
} from 'src/models/app.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chats: (OpenaiMessage | ChatMessage | SuggestedScheduleMessage)[] = [];
  constructor(private websocketService: WebsocketService) {}
  send(value: string) {
    this.websocketService.sendChatMessage(value);
  }
  control = new FormControl('');
  ngOnInit(): void {
    this.websocketService.message$.subscribe((event) => {
      const data = event.data;

      this.chats.push(event.data);
      console.log(this.chats);
    });
  }

  getDateString(
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number
  ) {
    return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(
      2,
      '0'
    )}/${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.control.value != '') {
      this.send(this.control.value ?? '');
      this.control.setValue('');
    }
  }

  
  create_meeting(){

  }

}
