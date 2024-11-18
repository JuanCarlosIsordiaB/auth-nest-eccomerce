import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeader } from './decorators';
import { User } from './entities';
import { IncomingHttpHeaders } from 'http';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
   @Req() request: Express.Request,
   @GetUser() user: User,
   @GetUser('email') userEmail: string,
   @RawHeader('rawHeaders') rawHeaders: string[],
   @Headers() headers: IncomingHttpHeaders
  ){
    
    return {
      ok: true,
      message: 'This is a private route', 
      user,
      userEmail,
      rawHeaders
    }
  }

  
}
