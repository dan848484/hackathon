import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { danCalendar } from "mockData/dan";
import { nobuCalendar } from "mockData/nobu";
import { Server, Socket } from "socket.io";
import {
  ChatMessage,
  MessageBase,
  OpenaiMessage,
  Schedule,
  SuggestedScheduleMessage,
} from "src/models/app.model";
import { OpenaiService } from "src/services/openai/openai.service";
import { v4 as uuid } from "uuid";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  wsClients: Socket[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    this.wsClients.push(client);
    console.log("接続開始時の接続数", this.wsClients.length);
  }

  constructor(private openaiService: OpenaiService) {}

  @SubscribeMessage("message")
  message(
    @MessageBody() data: MessageBase,
    @ConnectedSocket() client: Socket
  ): WsResponse<string> {
    console.log("接続数", this.wsClients.length);

    switch (data.type) {
      case "chat":
        const chatMessage: ChatMessage = data as ChatMessage;
        const name = chatMessage.user;
        const message = chatMessage.message;
        this.broadcast(chatMessage);
        console.log(message);
        //日付に関係してそうな言葉がテキスト中に含まれていたら、
        if (
          message.match(/\d+\/\d+/g) ||
          message.match(/\d+日/g) ||
          message.includes("明日") ||
          message.includes("明後日") ||
          message.includes("今日") ||
          message.includes("時") ||
          message.includes("会議") ||
          message.includes("ミーティング")
        ) {
          (async () => {
            const extractedData = await this.openaiService.extractPlanFromText(
              message
            );
            if (!extractedData) {
              console.log(
                "日付情報の取得を試みましたが、うまくいかなかったようです。"
              );
              return null;
            }
            extractedData.type = "openai";
            extractedData.targetUser = "!" + name;
            console.log("extractedData", extractedData);
            const schedule: Schedule = {
              id: "test",
              title: "スケジュール",
              startTime: new Date(
                extractedData.year,
                extractedData.month - 1,
                extractedData.day,
                extractedData.hour,
                extractedData.minutes
              ),
              endTime: new Date(
                extractedData.year,
                extractedData.month - 1,
                extractedData.day,
                extractedData.hour + 1,
                extractedData.minutes
              ),
            };

            if (
              this.detectDuplicatedDates(
                schedule,
                name == "dan" ? nobuCalendar : danCalendar
              )
            ) {
              const updatedScedule = this.suggestPossibleSchedule(
                schedule,
                name == "dan" ? nobuCalendar : danCalendar
              );
              const suggested_schedule: SuggestedScheduleMessage = {
                type: "suggested_schedule",
                operation: "create_meeting",
                targetUser: "!" + name,
                year: updatedScedule.startTime.getFullYear(),
                month: updatedScedule.startTime.getMonth() + 1,
                day: updatedScedule.startTime.getDate(),
                hour: updatedScedule.startTime.getHours(),
                minutes: updatedScedule.startTime.getMinutes(),
              };
              this.broadcast(suggested_schedule);
            } else {
              this.broadcast(extractedData);
            }
          })();
        }
        break;
      case "openai":
        const openaiMessage: OpenaiMessage = data as OpenaiMessage;
        //ここで何かやる
        break;
    }
    return null;
  }

  private broadcast(message: MessageBase) {
    const broadCastMessage = JSON.stringify(message);
    for (let c of this.wsClients) {
      c.send(broadCastMessage);
    }
  }

  handleDisconnect(client: Socket) {
    console.log("接続終了時の接続数（削除前）", this.wsClients.length);
    this.wsClients = this.wsClients.filter((c) => client != c);
    console.log("接続終了時の接続数（終了後）", this.wsClients.length);
  }

  private detectDuplicatedDates(target: Schedule, schedules: Schedule[]) {
    let duplicated = false;
    for (let s of schedules) {
      if (
        s.startTime.getTime() <= target.endTime.getTime() &&
        s.endTime.getTime() >= target.startTime.getTime()
      ) {
        duplicated = true;
        break;
      }
    }
    return duplicated;
  }

  private suggestPossibleSchedule(target: Schedule, schedules: Schedule[]) {
    let schedule = { ...target };
    console.log("-----");
    while (this.detectDuplicatedDates(schedule, schedules)) {
      schedule.startTime = new Date(
        schedule.startTime.getTime() + 30 * 60 * 1000
      );
      schedule.endTime = new Date(schedule.endTime.getTime() + 30 * 60 * 1000);
      console.log(schedule);
    }

    return schedule;
  }
}
