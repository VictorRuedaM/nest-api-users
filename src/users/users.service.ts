import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProfileDto } from './dto/create.profile.dto';
import { Profile } from './entities/profile.entity';

export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}
  async getUserByID(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['profile', 'posts'],
      });
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error.name !== 'HttpException') {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }
  async getUserByName(name: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          userName: name,
        },
        relations: ['profile', 'posts'],
      });
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error.name !== 'HttpException') {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async getUsers() {
    try {
      const users = await this.userRepository.find({
        relations: ['profile', 'posts'],
      });
      if (!users.length) {
        throw new HttpException(
          'Users Not Found in the DataBase',
          HttpStatus.NOT_FOUND,
        );
      }
      return users;
    } catch (error) {
      if (error.name !== 'HttpException') {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async createUser(user: CreateUserDto) {
    try {
      if (!user.userName) {
        throw new HttpException('Incorrect Params', HttpStatus.BAD_REQUEST);
      }
      const userFound = await this.userRepository.findOne({
        where: {
          userName: user.userName,
        },
      });
      if (userFound) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      const newUser = this.userRepository.create(user);
      this.userRepository.save(newUser);
      return 'User created successfully';
    } catch (error) {
      if (error.name !== 'HttpException') {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const userDeleted = await this.userRepository.delete({ id });
      if (userDeleted.affected === 0) {
        throw new HttpException(
          'User does not exist in the DataBase',
          HttpStatus.NOT_FOUND,
        );
      }
      return 'User deleted successfully';
    } catch (error) {
      if (error.name !== 'HttpException') {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async updateUser(id: number, user: UpdateUserDto) {
    try {
      const userUpdated = await this.userRepository.update({ id }, user);
      if (userUpdated.affected === 0) {
        throw new HttpException(
          'User does not exist in the DataBase',
          HttpStatus.NOT_FOUND,
        );
      }
      return 'User updated successfully';
    } catch (error) {
      if (error.name !== 'HttpException') {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['profile'],
      });
      if (user.profile !== null) {
        throw new HttpException(
          'The user already has a profile',
          HttpStatus.CONFLICT,
        );
      }
      const newProfile = this.profileRepository.create(profile);
      const saveProfile = await this.profileRepository.save(newProfile);
      user.profile = saveProfile;
      const userProfile = await this.userRepository.save(user);
      return userProfile;
    } catch (error) {
      if (error.name !== 'HttpException') {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }
}
