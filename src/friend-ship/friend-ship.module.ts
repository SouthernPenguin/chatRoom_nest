import { Module } from '@nestjs/common';
import { FriendShipService } from './friend-ship.service';
import { FriendShipController } from './friend-ship.controller';
import { UserModule } from 'src/user/user.module';
import { FriendShip } from './entities/friend-ship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([FriendShip]), WsModule],
  controllers: [FriendShipController],
  providers: [FriendShipService],
  exports: [FriendShipService],
})
export class FriendShipModule {}
