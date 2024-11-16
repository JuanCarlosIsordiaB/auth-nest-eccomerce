import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userWithoutPassword } = createUserDto;

      //No es la insercion, solo es para prepararlo
      const user = this.userRepository.create({
        ...userWithoutPassword,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return { ...userWithoutPassword, token: this.getJwtToken({ email: user.email }) };
      //TODO: Regresar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true },
      });

      if(!user ) throw new  UnauthorizedException('Invalid credentials');

      if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Invalid credentials');

      return {
        ...user,
        token: this.getJwtToken({ email: user.email }),
      };

    } catch (error) {}
  }

  private getJwtToken(payload: JwtPayload){
    // Gnererar el Token 
    const token = this.jwtService.sign(payload);
    return token;

  }

  private handleDBErrors(error: any): never {
    //never es para inidicar que JAMAS regresa un valor
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }

    console.log(error);
    throw new InternalServerErrorException('Internal server error');
  }
}
