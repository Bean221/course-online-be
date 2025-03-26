import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserDto,
  UserFilterType,
  UserPaginationResponseType,
} from './dto/user.dto';
import { users } from '.prisma/client';
import { hash } from 'bcrypt';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(body: CreateUserDto): Promise<users> {
    // bước 1 check email
    const user = await this.prismaService.users.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // bước 2 mã hóa password
    const hashedPassword = await hash(body.password, 10);

    // bước 3 tạo user
    const newUser = await this.prismaService.users.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    });

    return newUser;
  }
  async getAll(filters: UserFilterType): Promise<UserPaginationResponseType> {
    const item_per_page = Number(filters.item_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';

    const skip = page > 1 ? (page - 1) * item_per_page : 0;
    const users = await this.prismaService.users.findMany({
      take: item_per_page,
      skip,
      where: {
        OR: [
          { full_name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    const total = await this.prismaService.users.count({
      where: {
        OR: [
          { full_name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      },
    });
    return {
      data: users,
      total,
      currentPage: page,
      itemPerPage: item_per_page,
    };
  }
}
