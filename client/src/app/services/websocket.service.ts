import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ChatMessage,
  OpenaiMessage,
  SuggestedScheduleMessage,
} from 'src/models/app.model';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  isConnected: boolean = false;
  public connection?: WebSocket;
  private _message$ = new Subject<
    MessageEvent<OpenaiMessage | ChatMessage | SuggestedScheduleMessage>
  >();
  private _name?: string;
  get name() {
    return this._name;
  }
  get message$() {
    return this._message$.asObservable();
  }

  constructor() {
    this.connect();
  }

  connect() {
    this.connection = new WebSocket('ws://localhost:3000');
    this.connection.onopen = this.onOpen.bind(this);
    //エラー発生
    this.connection.onerror = this.onError.bind(this);
    //メッセージ受信
    this.connection.onmessage = this.onMessage.bind(this);
    //切断
    this.connection.onclose = this.onClose.bind(this);
  }

  private onOpen() {
    console.log('websocket接続しました。');
    this.isConnected = true;
  }

  private onError(error: any) {
    console.log('エラー', error);
    this.isConnected = false;
  }

  private onClose() {
    console.log('websocket切断しました。');
    this.isConnected = false;
    this.connection!.onopen = null;
    this.connection!.onerror = null;
    this.connection!.onmessage = null;
    this.connection!.onclose = null;
  }

  private onMessage(event: MessageEvent<string>) {
    console.log('受信', event);
    const data: ChatMessage | OpenaiMessage | SuggestedScheduleMessage =
      JSON.parse(event.data);
    if (
      (data.type === 'openai' || data.type === 'suggested_schedule') &&
      data.targetUser[0] === '!' &&
      data.targetUser.slice(1) === this.name
    ) {
      console.log('受け取らないイベント', event);
    } else {
      this._message$.next({ ...event, data });
    }
    this.isConnected = false;
  }
  sendChatMessage(value: string) {
    const chatMsg: ChatMessage = {
      type: 'chat',
      user: this.name!,
      message: value,
    };
    this.connection?.send(JSON.stringify({ event: 'message', data: chatMsg }));
  }

  registerUserName(name: string) {
    this._name = name;
  }
}
