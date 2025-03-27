import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, full_name, phone } = createUserDto;

    // Kiểm tra user đã tồn tại
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User với email này đã tồn tại.');
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới user (lưu ý sử dụng createdAt và updatedAt nếu cần, nhưng nếu schema đã định nghĩa @default(now()) và @updatedAt thì không cần set thủ công)
    const user = await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        full_name,
        phone,
        role: 'student', // Mặc định, hoặc tùy logic của bạn
        // Nếu schema đã tự động cập nhật createdAt và updatedAt, bạn không cần truyền vào
      },
    });

    // Sinh JWT token (loại bỏ password trước khi trả về)
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    };
  }
  async findByResetToken(token: string) {
    return this.prisma.users.findFirst({
      where: { reset_token: token },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }
  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  async setResetToken(email: string, resetToken: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Assuming you have a user repository or ORM to update the user
    await this.prisma.users.update({
      where: { email },
      data: { reset_token: resetToken },
    });
  }
  async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.users.update({
      where: { id },
      data: { password: hashedPassword, reset_token: null },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        role: true,
        updated_at: true,
      },
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Kiểm tra user có tồn tại không
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Nếu có cập nhật password thì hash lại
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: {
          ...updateUserDto,
          role: updateUserDto.role,
        },
        select: {
          id: true,
          email: true,
          full_name: true,
          phone: true,
          created_at: true,
          updated_at: true,
        },
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Internal server error during update');
    }
  }
  async remove(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.prisma.users.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
