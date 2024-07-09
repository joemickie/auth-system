import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
        const { email, password } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({ email, password: hashedPassword, role: Role.User });
        try {
            await this.userRepository.save(user);
            return { message: 'User created successfully' };
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('User already exists');
            } else {
                throw new InternalServerErrorException('Internal server error');
            }
        }
    }

    async registerAdmin(createAdminDto: CreateUserDto): Promise<User> {
        const { email, password } = createAdminDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, password: hashedPassword, role: Role.Admin });
        try {
          await this.userRepository.save(user);
          return user;
        } catch (error) {
          if (error.code === '23505') {
            throw new ConflictException('Admin user already exists');
          }
          throw error;
        }
      }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
