import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CreatedFriendShipPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.sortedKey = `${value.userId}-${value.friendId}`;
    return value;
  }
}
