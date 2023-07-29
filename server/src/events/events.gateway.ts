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
import { Server, Socket } from "socket.io";
import { ChatMessage, MessageBase, OpenaiMessage } from "src/models/app.model";
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
        //日付に関係してそうな言葉がテキスト中に含まれていたら、
        if (
          message.match(/\d+\/\d+/g) ||
          message.match(/\d+日/g) ||
          message.includes("明日") ||
          message.includes("明後日")
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
            this.broadcast(extractedData);
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
}
