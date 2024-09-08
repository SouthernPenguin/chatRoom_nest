/**
 * 模块名: 返回格式与类型
 * 代码描述:
 * 作者:Fant
 * 创建时间:2024/09/08 10:20:35
 */

import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/role/entities/role.entity';

class UserInfo {
  id: number;
  name: string;
  roles: Role[];
}
export class ReturnAdminLoginDto {
  @ApiProperty({ type: String, description: 'token' })
  token: string;
  @ApiProperty({ type: UserInfo, description: '用户信息' })
  userInfo: UserInfo;
}
