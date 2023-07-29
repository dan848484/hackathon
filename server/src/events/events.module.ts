import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import { OpenaiService } from "src/services/openai/openai.service";

@Module({
  providers: [EventsGateway, OpenaiService],
  imports: [],
})
export class EventsModule {}
