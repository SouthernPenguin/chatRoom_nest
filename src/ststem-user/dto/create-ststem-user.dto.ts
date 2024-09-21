export class CreateStstemUserDto {}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export class CreateSystemUserDto {
  @ApiProperty({ example: '账号', description: '账号' })
  @IsString()
  @IsNotEmpty({ groups: ['create'], message: '账号必须填写' })
  name: string;

  @ApiProperty({ example: '密码', description: '密码' })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ example: '角色名', description: '角色名' })
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

export class ReturnListDto {
  @ApiProperty({ example: '账号', description: '账号' })
  @IsString()
  @IsNotEmpty({ groups: ['create'], message: '账号必须填写' })
  name: string;

  @ApiProperty({ example: '角色名', description: '角色名' })
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
