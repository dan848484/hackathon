import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Schedule } from 'src/models/app.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  constructor(
    private calendarService: CalendarService,
    private websocketService: WebsocketService
  ) {}

  private subscription = new Subscription();

  calendar: Schedule[] = [];
  schedulesByDate = new Array(31).fill([]);

  ngOnInit(): void {
    this.update();
    if (!this.websocketService.name) {
      return;
    }
    this.subscription.add(
      this.calendarService
        .getCalendar(this.websocketService.name!)
        .subscribe((calendars) => {
          this.calendar = calendars;
          this.update();
        })
    );
  }

  day_list = ['日', '月', '火', '水', '木', '金', '土'];
  year = 2023;
  month = 7;

  last_day: number = 0;
  date = new Date();
  dayOfWeek: number = 0;
  date_list: (number | string)[] = [];

  // last_day = new Date(this.year, this.month, 0).getDate();

  // date = new Date(this.year, this.month - 1, 1);
  // dayOfWeek = this.date.getDay();

  // date_list = [...Array(this.last_day)].map((_, i) => i + 1);

  update() {
    this.last_day = new Date(this.year, this.month, 0).getDate();

    this.date = new Date(this.year, this.month - 1, 1);
    this.dayOfWeek = this.date.getDay();

    this.date_list = [...Array(this.last_day)].map((_, i) => i + 1);
    for (let i = 0; i < this.dayOfWeek; i++) this.date_list.unshift('');

    this.schedulesByDate = new Array(31).fill([]);

    for (let s of this.calendar) {
      console.log(s);

      if (this.month !== s.startTime.getMonth() + 1) {
        continue;
      }

      this.schedulesByDate[s.startTime.getDate() - 1] = [
        ...this.schedulesByDate[s.startTime.getDate() - 1],
        s,
      ];
    }
  }
  isNumber(num: any) {
    return typeof num === 'number';
  }

  getTitleWithTime(schedule: Schedule) {
    return `${String(schedule.startTime.getHours()).padStart(2, '0')}:${String(
      schedule.startTime.getMinutes()
    ).padStart(2, '0')} ${schedule.title}`;
  }

  previous_month() {
    this.month--;
    this.update();
    if (this.month == 0) {
      this.year--;
      this.month = 12;
    }
  }
  next_month() {
    this.month++;
    this.update();
    if (this.month == 13) {
      this.year++;
      this.month = 1;
    }
  }
}
