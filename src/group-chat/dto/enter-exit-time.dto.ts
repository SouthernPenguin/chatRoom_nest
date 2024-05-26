import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { DateRules } from 'src/rules/DeteRules';
export class EnterExitTime {
  @IsNumber()
  @IsNotEmpty({ message: '群名id不能为空' })
  @ApiProperty({
    example: '',
    description: '群名称',
    name: 'groupId',
    type: Number,
  })
  groupId: number;

  // @IsDate()
  @Validate(DateRules)
  // @IsNotEmpty({ message: '进入时间不能为空' })
  @ApiProperty({
    example: '2024-5-11 9:52:49',
    description: '进入时间',
    name: 'enterTime',
  })
  enterTime: Date;

  // @IsDate()
  @Validate(DateRules)
  // @IsNotEmpty({ message: '离开时间不能为空' })
  @ApiProperty({
    example: '2024-5-11 9:52:49',
    description: '离开时间',
    name: 'exitTime',
  })
  exitTime: Date;
}
