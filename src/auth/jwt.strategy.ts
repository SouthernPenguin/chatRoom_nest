import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import redConfigFile from 'src/utils/redConfigFile';

const mySqlConfig: any = redConfigFile();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: mySqlConfig.JWT.secret,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
