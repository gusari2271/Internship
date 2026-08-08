import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@example.com';
    const count = await this.userRepository.count({ where: { email: adminEmail } });
    if (count === 0) {
      console.log('Seeding initial admin user...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      const admin = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
      });
      await this.userRepository.save(admin);
      console.log('Admin user successfully seeded: admin@example.com / password123');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
