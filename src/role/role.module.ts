// 角色
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { MenuModule } from 'src/menu/menu.module';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';

@Module({
  imports: [MenuModule, TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RoleModule {}
