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
    try {
      await this.userService.getUserByID(post.authorId);
      const newPost = this.postRepository.create(post);
      const postSave = await this.postRepository.save(newPost);
      return postSave;
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

  async getPosts() {
    try {
      const posts = await this.postRepository.find({
        relations: ['author'],
      });
      if (!posts.length) {
        throw new HttpException('Posts Not Found', HttpStatus.NOT_FOUND);
      }
      return posts;
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

  async getPostById(id: number) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: ['author'],
      });
      if (!post) {
        throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
      }
      return post;
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

  async updatePost(id: number, updatePost: UpdatePostDto) {
    try {
      const postUpdate = await this.postRepository.update({ id }, updatePost);
      if (postUpdate.affected === 0) {
        throw new HttpException(
          'Post does not exist in the DataBase',
          HttpStatus.NOT_FOUND,
        );
      }
      return 'Post Updated successfully';
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

  async deletePost(id: number) {
    try {
      const postDeleted = await this.postRepository.delete({ id });
      if (postDeleted.affected === 0) {
        throw new HttpException(
          'Post does not exist in the DataBase',
          HttpStatus.NOT_FOUND,
        );
      }
      return 'Post Deleted successfully';
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
