import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UsersService,
  ) {}
  async createPost(post: CreatePostDto) {
    await this.userService.getUserByID(post.authorId);
    const newPost = this.postRepository.create(post);
    const postSave = await this.postRepository.save(newPost);
    return postSave;
  }

  async getPosts() {
    const posts = await this.postRepository.find({
      relations: ['author'],
    });
    if (!posts.length) {
      throw new HttpException('Posts Not Found', HttpStatus.NOT_FOUND);
    }
    return posts;
  }

  getPostById(id: number) {
    return `This action returns a #${id} post`;
  }

  updatePost(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  deletePost(id: number) {
    return `This action removes a #${id} post`;
  }
}
