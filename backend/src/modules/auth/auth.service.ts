import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id, user.email);

    return {
      user: {
        id: user._id,
        email: user.email,
      },
      ...tokens,
    };
  }

  async validateUser(userId: string) {
    return this.userService.findById(userId);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const tokens = await this.generateTokens(payload.sub, payload.email);
      return tokens;
    } catch (error: unknown) {
      console.log('error =>', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  //   async logout(userId: string) {
  //     // Implement token invalidation logic here if needed
  //     return { message: 'Logged out successfully' };
  //   }

  private async generateTokens(userId: Types.ObjectId, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        privateKey: process.env.JWT_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        privateKey: process.env.JWT_SECRET,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
