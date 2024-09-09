import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from './entities/ststem-user.entity';
import { SystemUserController } from './ststem-user.controller';
import { SystemUserService } from './ststem-user.service';
import { RoleModule } from 'src/role/role.module';
@Module({
  imports: [RoleModule, TypeOrmModule.forFeature([SystemUser])],
  controllers: [SystemUserController],
  providers: [SystemUserService],
  exports: [SystemUserService], // 当其他模块需要使用Service是需要导出
})
export class SystemUserModule {}
