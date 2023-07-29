import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { danCalendar } from "mockData/dan";
import { nobuCalendar } from "mockData/nobu";
import { Schedule, ScheduleDto } from "src/models/app.model";
import { CalendarService } from "src/services/calendar/calendar.service";

@Controller("calendar")
export class CalendarController {
  constructor(private calendarService: CalendarService) {}
  @Get(":user")
  getCalendar(@Param() param: any): Schedule[] {
    return this.calendarService.getCalendar(param.user);
  }
  @Post(":user")
  postCalendar(@Param() param: any, @Body() body: ScheduleDto): Schedule {
    const schedule: Schedule = {
      id: body.id,
      title: body.title,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    };
    console.log("リクエストがありました");
    return this.calendarService.addSchedule(param.user, schedule);
  }
}
