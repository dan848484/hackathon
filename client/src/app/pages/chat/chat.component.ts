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
}
