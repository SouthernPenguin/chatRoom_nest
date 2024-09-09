import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Menu } from 'src/menu/entities/menu.entity';

export class CreateRoleDto {
  @ApiProperty({ example: '角色姓名', description: '角色姓名' })
  @IsString()
  @IsNotEmpty({ groups: ['create'], message: '角色姓名必须填写' })
  name: string;

  @ApiProperty({ example: '菜单id', description: '菜单id' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { each: true },
  )
  @IsNotEmpty({ groups: ['create'], message: '菜单id' })
  menuIds: number[];

  menus: Menu[];
}
