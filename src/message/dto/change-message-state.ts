import { OmitType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class ChangeMessageState extends OmitType(CreateMessageDto, [
  'postMessage',
  'state',
  'fileType',
  'createdTime',
  'msgType',
]) {}
