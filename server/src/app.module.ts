import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventsGateway } from "./events/events.gateway";
// import { EventsModule } from "./events/events.module";
import { CalendarController } from "./controllers/calendar/calendar.controller";
import { CalendarService } from "./services/calendar/calendar.service";
import { OpenaiController } from "./controllers/openai/openai.controller";
import { OpenaiService } from "./services/openai/openai.service";
import { CorsMiddleware } from "./cors.middleware";

@Module({
  imports: [],
  controllers: [AppController, CalendarController, OpenaiController],
  providers: [AppService, CalendarService, OpenaiService, EventsGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes("*");
  }
}
