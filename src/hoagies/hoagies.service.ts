import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hoagie } from './schemas/hoagie.schema';

@Injectable()
export class HoagiesService {
  constructor(@InjectModel(Hoagie.name) private hoagieModel: Model<Hoagie>) {}

  async create(createHoagieDto: {
    name: string;
    ingredients: string[];
    picture?: string;
    creator: string;
  }): Promise<Hoagie> {
    const createdHoagie = new this.hoagieModel(createHoagieDto);
    const savedHoagie = await createdHoagie.save();
    return savedHoagie;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Hoagie[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.hoagieModel
          .find()
          .populate('creator', 'name email')
          .populate('collaborators', 'name email')
          .skip(skip)
          .limit(limit)
          .exec(),
        this.hoagieModel.countDocuments().exec(),
      ]);
      return { data, total };
    } catch (error) {
      console.error(`Error finding all hoagies: ${error.message}`, error.stack);
      throw new Error('Failed to find all hoagies');
    }
  }

  async findOne(id: string): Promise<Hoagie> {
    try {
      const hoagie = await this.hoagieModel
        .findById(id)
        .populate('creator', 'name email')
        .populate('collaborators', 'name email')
        .exec();
      if (!hoagie) {
        throw new NotFoundException('Hoagie not found');
      }
      return hoagie;
    } catch (error) {
      console.error(`Error finding hoagie: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to find hoagie');
    }
  }

  async update(id: string, updateHoagieDto: Partial<Hoagie>): Promise<Hoagie> {
    try {
      const updatedHoagie = await this.hoagieModel
        .findByIdAndUpdate(id, updateHoagieDto, { new: true })
        .populate('creator', 'name email')
        .populate('collaborators', 'name email')
        .exec();
      if (!updatedHoagie) {
        throw new NotFoundException('Hoagie not found');
      }
      return updatedHoagie;
    } catch (error) {
      console.error(`Error updating hoagie: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update hoagie');
    }
  }

  async remove(id: string): Promise<Hoagie> {
    try {
      const removedHoagie = await this.hoagieModel.findByIdAndDelete(id).exec();
      if (!removedHoagie) {
        throw new NotFoundException('Hoagie not found');
      }
      return removedHoagie;
    } catch (error) {
      console.error(`Error removing hoagie: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to remove hoagie');
    }
  }

  async addCollaborator(hoagieId: string, userId: string): Promise<Hoagie> {
    try {
      const updatedHoagie = await this.hoagieModel
        .findByIdAndUpdate(
          hoagieId,
          { $addToSet: { collaborators: userId } },
          { new: true },
        )
        .populate('creator', 'name email')
        .populate('collaborators', 'name email')
        .exec();
      if (!updatedHoagie) {
        throw new NotFoundException('Hoagie not found');
      }
      return updatedHoagie;
    } catch (error) {
      console.error(`Error adding collaborator: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to add collaborator');
    }
  }

  async removeCollaborator(hoagieId: string, userId: string): Promise<Hoagie> {
    try {
      const updatedHoagie = await this.hoagieModel
        .findByIdAndUpdate(
          hoagieId,
          { $pull: { collaborators: userId } },
          { new: true },
        )
        .populate('creator', 'name email')
        .populate('collaborators', 'name email')
        .exec();
      if (!updatedHoagie) {
        throw new NotFoundException('Hoagie not found');
      }
      return updatedHoagie;
    } catch (error) {
      console.error(
        `Error removing collaborator: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to remove collaborator');
    }
  }
}
