import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BackMessageDto {
  @IsNotEmpty({ message: '记录id不能为空' })
  @ApiProperty({
    example: '',
    description: '记录id不能为空',
    name: 'id',
    type: Number,
  })
  id: number;

  @IsNotEmpty({ message: '群id不能为空' })
  @ApiProperty({
    example: '',
    description: '群id不能为空',
    name: 'groupId',
    type: Number,
  })
  groupId: number;
}
