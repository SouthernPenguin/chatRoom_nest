import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateUploadDto {
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: '',
    description: '文件',
    name: 'file',
  })
  file: any;

  // @IsNumber()
  // @IsEnum(
  //   { 男: 0, 女: 1, 保密: 2 },
  //   {
  //     message: 'gender只能传入数字0或1,2',
  //   },
  // )
  // @Type(() => Number)
  // @ApiProperty({
  //   description: '性别：男: 0, 女: 1, 保密: 2',
  //   example: 0,
  //   name: 'gender',
  //   type: Number,
  //   required: false,
  // })
  // upLoadType:
}
