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
import { ChatMessage } from "src/models/app.model";
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
  }

  @SubscribeMessage("message")
  message(
    @MessageBody() data: ChatMessage,
    @ConnectedSocket() client: Socket
  ): WsResponse<string> {
    const name = data.user;
    const message = data.message;
    this.broadcast(data);
    return null;
  }

  private broadcast(message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (let c of this.wsClients) {
      c.send(broadCastMessage);
    }
  }

  handleDisconnect(client: Socket) {
    this.wsClients = this.wsClients.filter((client) => client != client);
  }
}
