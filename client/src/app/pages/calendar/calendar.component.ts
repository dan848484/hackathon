import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.update();
  }

  day_list = ["日","月","火","水","木","金","土"];
  year = 2023;
  month = 7;

  last_day:number = 0;
  date = new Date;
  dayOfWeek:number = 0;
  date_list:(number|string)[] = [];

  // last_day = new Date(this.year, this.month, 0).getDate();

  // date = new Date(this.year, this.month - 1, 1);
  // dayOfWeek = this.date.getDay();

  // date_list = [...Array(this.last_day)].map((_, i) => i + 1);

  update(){
    this.last_day = new Date(this.year, this.month, 0).getDate();

    this.date = new Date(this.year, this.month - 1, 1);
    this.dayOfWeek = this.date.getDay();

    this.date_list = [...Array(this.last_day)].map((_, i) => i + 1);
    for(let i = 0; i < this.dayOfWeek; i++)
    this.date_list.unshift("");
  }

  previous_month(){
    this.month --;
    this.update();
    if(this.month == 0){
      this.year --;
      this.month = 12;
    }
  }
  next_month(){
    this.month ++;
    this.update();
    if(this.month == 13){
      this.year ++;
      this.month = 1;
    }
  }


}
