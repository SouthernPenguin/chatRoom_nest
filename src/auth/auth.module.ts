import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import redConfigFile from 'src/utils/redConfigFile';

const mySqlConfig: any = redConfigFile();

const jwtModule = JwtModule.register({
  secret: mySqlConfig.JWT.secret,
  signOptions: { expiresIn: mySqlConfig.JWT.expiresIn },
});

@Module({
  imports: [
    UserModule,
    jwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [jwtModule],
})
export class AuthModule {}
