import { Controller, Body, Post, Query, Get } from '@nestjs/common';
import {
  CreateUserDto,
  UserFilterType,
  UserPaginationResponseType,
} from './dto/user.dto';
import { users } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userServive: UserService) {}
  @Post()
  create(@Body() body: CreateUserDto): Promise<users> {
    console.log('Creating user api: ', body);
    return this.userServive.create(body);
  }
  @Get()
  GetAll(@Query() Params: UserFilterType): Promise<UserPaginationResponseType> {
    console.log('Get all users api: ', Params);
    return this.userServive.getAll(Params);
  }
}
