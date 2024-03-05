import { OmitType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
// import { IsArray, IsOptional } from 'class-validator';

export class ChangeMessageState extends OmitType(CreateMessageDto, [
  'postMessage',
  'state',
  'fileType',
  'createdTime',
  'msgType',
]) {}
