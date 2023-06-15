import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';

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

  createUser(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    this.userRepository.save(newUser);
  }
}
