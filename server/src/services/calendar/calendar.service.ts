import { Injectable } from "@nestjs/common";
import { danCalendar } from "mockData/dan";
import { nobuCalendar } from "mockData/nobu";
import { Schedule } from "src/models/app.model";

@Injectable()
export class CalendarService {
  calendars = {
    dan: [...danCalendar],
    nobu: [...nobuCalendar],
  };

  getCalendar(user: string) {
    switch (user) {
      case "dan":
        return this.calendars.dan;
      default:
        return this.calendars.nobu;
    }
  }

  addSchedule(user: string, schedule: Schedule) {
    switch (user) {
      case "dan":
        this.calendars.dan.push(schedule);
        break;
      default:
        this.calendars.nobu.push(schedule);
        break;
    }
    return schedule;
  }
}
