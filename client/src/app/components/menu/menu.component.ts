import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    private router: Router,
    public websocketService: WebsocketService
  ) {}

  ngOnInit(): void {}

  toCalendar() {
    this.router.navigateByUrl('calendar');
  }

  toChat() {
    this.router.navigateByUrl('chat');
  }
}
