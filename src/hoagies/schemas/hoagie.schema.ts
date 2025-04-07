import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Hoagie extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [String] })
  ingredients: string[];

  @Prop()
  picture: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: User & { _id: string };

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  collaborators: User & { _id: string }[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const HoagieSchema = SchemaFactory.createForClass(Hoagie);
