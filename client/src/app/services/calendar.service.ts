import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Schedule } from 'src/models/app.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}
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
  postCalendar(user: string, schedule: Schedule) {
    return this.http.post<Schedule>(
      `http://localhost:3000/calendar/${user}`,
      schedule
    );
  }
}
