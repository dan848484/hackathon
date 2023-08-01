import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CalendarService } from 'src/app/services/calendar.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import {
  ChatMessage,
  CreatedScheduleMessage,
  OpenaiMessage,
  Schedule,
  SuggestedScheduleMessage,
} from 'src/models/app.model';
import { v4 as uuid } from 'uuid';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations:[trigger('appear',[
    state('unvisible',style({
      opacity:0
    })),
    state('unvisible',style({
      opacity:0
    })),

  ])]
})
export class ChatComponent implements OnInit {
  chats: (
    | OpenaiMessage
    | ChatMessage
    | SuggestedScheduleMessage
    | CreatedScheduleMessage
  )[] = [];
  constructor(
    private websocketService: WebsocketService,
    private calendarService: CalendarService
  ) {}
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

  getDateStringFromDateObj(date: Date) {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}/${String(date.getDate()).padStart(2, '0')}/${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.control.value != '') {
      this.send(this.control.value ?? '');
      this.control.setValue('');
    }
  }
  createMeeting(chat: OpenaiMessage | SuggestedScheduleMessage) {
    const schedule: Schedule = {
      id: uuid(),
      title: 'ミーティング',
      startTime: new Date(
        chat.year,
        chat.month - 1,
        chat.day,
        chat.hour,
        chat.minutes
      ),
      endTime: new Date(
        chat.year,
        chat.month - 1,
        chat.day,
        chat.hour + 1,
        chat.minutes
      ),
    };
    if (!this.websocketService.name) {
      throw new Error('ユーザー名取得できませんでした');
    }
    this.calendarService.postCalendar(schedule);
  }
}
