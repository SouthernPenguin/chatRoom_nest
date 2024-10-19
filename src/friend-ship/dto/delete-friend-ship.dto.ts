import { OmitType } from '@nestjs/swagger';
import { CreateFriendShipDto } from './create-friend-ship.dto';
export class DeleteUserDto extends OmitType(CreateFriendShipDto, ['state', 'fromUserId', 'notes']) {}
