import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Menu } from 'src/menu/entities/menu.entity';

export class UpdateRoleDto {
  @ApiProperty({ example: [1, 2, 3], description: '请传入菜单' })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { each: true },
  )
  @IsNotEmpty({ groups: ['create'], message: '请传入菜单' })
  menuIds: number[];

  menus: Menu[];
}
