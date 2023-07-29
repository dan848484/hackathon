import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatMessage } from 'src/models/app.model';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  isConnected: boolean = false;
  public connection?: WebSocket;
  private _message$ = new Subject<MessageEvent>();
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

  private onMessage(event: MessageEvent<ChatMessage>) {
    console.log('受信');
    this.isConnected = false;
    this._message$.next(event);
  }

  send(value: string) {
    console.log(this.connection);
    this.connection?.send(JSON.stringify({ event: 'message', data: value }));
  }

  registerUserName(name: string) {
    this._name = name;
  }
}
