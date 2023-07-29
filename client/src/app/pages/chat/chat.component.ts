import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

