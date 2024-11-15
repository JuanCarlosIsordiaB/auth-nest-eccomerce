import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

      return {...userWithoutPassword};
      //TODO: Regresar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
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
