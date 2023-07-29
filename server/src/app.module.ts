import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventsGateway } from "./events/events.gateway";
import { EventsModule } from "./events/events.module";
import { CalendarController } from "./controllers/calendar/calendar.controller";
import { CalendarService } from "./services/calendar/calendar.service";
import { OpenaiController } from "./controllers/openai/openai.controller";
import { OpenaiService } from "./services/openai/openai.service";

@Module({
  imports: [EventsModule],
  controllers: [AppController, CalendarController, OpenaiController],
  providers: [AppService, CalendarService, OpenaiService],
})
export class AppModule {}
