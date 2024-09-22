import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class UpdateSystemUserDto {
  // @ApiProperty({ example: '账号', description: '账号' })
  // @IsString()
  // @IsNotEmpty({ message: '账号必须填写' })
  // name: string;

  @ApiProperty({ example: '角色id', description: '角色id' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { each: true },
  )
  @IsNotEmpty({ groups: ['create'], message: '角色必须填写' })
  roleIds: number[];

  roles: Role[];
}

export class ChangeSystemUserPasswordDto {
  @ApiProperty({ example: '老密码', description: '老密码' })
  @IsString()
  @Length(6)
  @IsNotEmpty({ message: '老密码必须填写' })
  oldPassword: string;

  @ApiProperty({ example: '新密码', description: '新密码' })
  @IsString()
  @Length(6)
  @IsNotEmpty({ message: '新密码必须填写' })
  newPassword: string;
}
