import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),  // Sign the JWT token
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    // TODO: Add logic to validate the user from the database
    const user = { userId: 1, username: 'testuser' };  // Mock user for example
    if (user && user.username === username) {
      return user;
    }
    return null;
  }
}
