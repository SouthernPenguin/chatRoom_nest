import { Module } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { MenusController } from './menu.controller';
import { MenusService } from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenuModule {}
