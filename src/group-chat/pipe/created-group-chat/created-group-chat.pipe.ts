import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CreatedGroupChatPipe implements PipeTransform {
  transform(
    value: { name: string; userIds: number[] },
    metadata: ArgumentMetadata,
  ) {
    if (value.userIds.length < 2) {
      throw new BadRequestException('群聊必须两个人及以上');
    }
    return value;
  }
}
