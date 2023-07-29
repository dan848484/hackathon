import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {
  constructor(
    private websocketService: WebsocketService,
    private router: Router
  ) {}
  nameControl = new FormControl('');
  ngOnInit(): void {}

  onClick() {
    if (!!this.nameControl.value) {
      this.websocketService.registerUserName(this.nameControl.value);
      this.router.navigate(['chat']);
    }
  }
}
