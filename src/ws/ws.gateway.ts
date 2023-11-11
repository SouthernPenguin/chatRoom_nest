import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsService } from './ws.service';
import { CreateWDto } from './dto/create-w.dto';
import { UpdateWDto } from './dto/update-w.dto';
import { Server } from 'http';

@WebSocketGateway({
  cors: true,
})
export class WsGateway {
  constructor(private readonly wsService: WsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createW')
  create(@MessageBody() createWDto: CreateWDto) {
    return this.wsService.create(createWDto);
  }

  @SubscribeMessage('findAllWs')
  findAll() {
    return this.wsService.findAll();
  }

  @SubscribeMessage('findOneW')
  findOne(@MessageBody() id: number) {
    return this.wsService.findOne(id);
  }

  @SubscribeMessage('updateW')
  update(@MessageBody() updateWDto: UpdateWDto) {
    return this.wsService.update(updateWDto.id, updateWDto);
  }

  @SubscribeMessage('removeW')
  remove(@MessageBody() id: number) {
    return this.wsService.remove(id);
  }
}
