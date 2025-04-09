import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { Hoagie } from "../../hoagies/schemas/hoagie.schema";

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user: User & { _id: string };

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Hoagie",
    required: true,
  })
  hoagie: Hoagie & { _id: string };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
