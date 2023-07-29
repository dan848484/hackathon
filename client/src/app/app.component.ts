import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    var connection = new WebSocket('ws://localhost:3000');
    //接続通知
    connection.onopen = function (event) {
      console.log('接続');
      setTimeout(() => {
        connection.send(
          JSON.stringify({ event: 'message', data: 'こんにちわ！' })
        );
      }, 100);
    };

    //エラー発生
    connection.onerror = function (error) {
      console.log('エラー', error);
    };

    //メッセージ受信
    connection.onmessage = function (event) {
      console.log('受信', event);
    };

    //切断
    connection.onclose = function () {
      console.log('切断');
    };
  }
  title = 'apc';
}
