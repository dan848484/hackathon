import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  wsClients: Socket[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    this.wsClients.push(client);
  }

  @SubscribeMessage('message')
  message(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): WsResponse<string> {
    console.log(data);
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
