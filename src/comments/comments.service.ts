import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(createCommentDto: {
    text: string;
    user: string;
    hoagie: string;
  }): Promise<Comment> {
    try {
      const createdComment = new this.commentModel(createCommentDto);
      return createdComment.save();
    } catch (error) {
      console.error(`Error creating comment: ${error.message}`, error.stack);
      throw new Error('Failed to create comment');
    }
  }

  async findAllByHoagie(hoagieId: string): Promise<Comment[]> {
    try {
      const allComments = await this.commentModel
        .find({ hoagie: hoagieId })
        .populate('user', '-password')
        .sort({ createdAt: +1 })
        .exec();

      return allComments;
    } catch (error) {
      console.error(
        `Error finding all comments by hoagie: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to find all comments by hoagie');
    }
  }
  async findOne(id: string): Promise<Comment | null> {
    try {
      const comment = await this.commentModel
        .findById(id)
        .populate('user', '-password')
        .exec();

      if (!comment) {
        return null;
      }

      return comment;
    } catch (error) {
      console.error(`Error finding comment: ${error.message}`, error.stack);
      throw new Error('Failed to find comment');
    }
  }

  async update(
    id: string,
    updateCommentDto: Partial<Comment>,
  ): Promise<Comment> {
    try {
      const updatedComment = await this.commentModel
        .findByIdAndUpdate(id, updateCommentDto, { new: true })
        .populate('user', '-password')
        .exec();

      if (!updatedComment) {
        throw new Error('Comment not found');
      }

      return updatedComment;
    } catch (error) {
      console.error(`Error updating comment: ${error.message}`, error.stack);
      throw new Error('Failed to update comment');
    }
  }

  async remove(id: string): Promise<Comment | null> {
    try {
      const deletedComment = await this.commentModel
        .findByIdAndDelete(id)
        .exec();

      return deletedComment || null;
    } catch (error) {
      console.error(`Error removing comment: ${error.message}`, error.stack);
      throw new Error('Failed to remove comment');
    }
  }

  async countByHoagie(hoagieId: string): Promise<number> {
    try {
      return this.commentModel.countDocuments({ hoagie: hoagieId }).exec();
    } catch (error) {
      console.error(
        `Error counting comments by hoagie: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to count comments by hoagie');
    }
  }
}
