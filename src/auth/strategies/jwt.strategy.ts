import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
    console.log('JwtStrategy initialized with secret:', process.env.JWT_SECRET);
  }

  validate(payload: { sub: string; email: string }) {
    console.log('JwtStrategy payload:', payload);
    // Lưu ý: nếu bạn lưu user id trong payload với key 'sub'
    return { id: payload.sub, email: payload.email };
  }
}
