import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),  
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = { userId: 1, username: 'testuser' };  // Mock user for example
    if (user && user.username === username) {
      return user;
    }
    return null;
  }
}
