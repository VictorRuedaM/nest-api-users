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
  async getUserByID(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async getUserByName(name: string) {
    const user = await this.userRepository.findOne({
      where: {
        userName: name,
      },
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUsers() {
    const users = await this.userRepository.find();
    if (!users.length) {
      throw new HttpException(
        'Users Not Found in the DataBase',
        HttpStatus.NOT_FOUND,
      );
    }
    return users;
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
    if (userDeleted.affected === 0) {
      throw new HttpException(
        'User does not exist in the DataBase',
        HttpStatus.NOT_FOUND,
      );
    }
    return 'User deleted successfully';
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userUpdated = await this.userRepository.update({ id }, user);
    if (userUpdated.affected === 0) {
      throw new HttpException(
        'User does not exist in the DataBase',
        HttpStatus.NOT_FOUND,
      );
    }
    return 'User updated successfully';
  }
}
