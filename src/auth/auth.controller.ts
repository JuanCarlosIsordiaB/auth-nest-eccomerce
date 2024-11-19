import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeader, RoleProtected } from './decorators';
import { User } from './entities';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';


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

  @Get('private2')
  //@SetMetadata('roles', ['user'])
  @RoleProtected(ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }
  }


  @Get('private3')
  @Auth(ValidRoles.superUser)
  privateRoute3(
    @GetUser() user: User
  ){
    return {
      user,
      ok: true
    }
  }

  
}
