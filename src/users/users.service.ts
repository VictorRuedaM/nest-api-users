import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  getUserByID(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
  getUserByName(name: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        userName: name,
      },
    });
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: CreateUserDto) {
    const userFound = await this.getUserByName(user.userName);
    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create(user);
    this.userRepository.save(newUser);
    return 'User created successfully';
  }

  async deleteUser(id: number) {
    const userDeleted = await this.userRepository.delete({ id });
    if (userDeleted.affected === 1) {
      return 'User deleted successfully';
    } else {
      return 'User does not exist in DB';
    }
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userUpdated = await this.userRepository.update({ id }, user);
    if (userUpdated.affected === 1) {
      return 'User updated successfully';
    } else {
      return 'User does not exist in DB';
    }
  }
}
