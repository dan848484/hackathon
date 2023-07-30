import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Schedule } from 'src/models/app.model';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(
    private http: HttpClient,
    private websocketService: WebsocketService
  ) {}
  getCalendar(name: string) {
    return this.http
      .get<Schedule[]>(`http://localhost:3000/calendar/${name}`)
      .pipe(
        map((ss) => {
          return ss.map((s) => {
            s.startTime = new Date(s.startTime);
            s.endTime = new Date(s.startTime);
            return s;
          });
        })
      );
  }
  postCalendar(schedule: Schedule) {
    // return this.http.post<Schedule>(
    //   `http://localhost:3000/calendar/${user}`,
    //   schedule
    // );
    this.websocketService.confirmMessage(schedule);
  }
}
