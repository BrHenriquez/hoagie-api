import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './schemas/comment.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../core/decorators/current-user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCommentDto: { text: string; hoagie: string },
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    console.log('createCommentDto', createCommentDto, req);
    return this.commentsService.create({
      ...createCommentDto,
      user: req.user._id,
    });
  }

  @Get('hoagie/:hoagieId')
  async findAllByHoagie(
    @Param('hoagieId') hoagieId: string,
  ): Promise<Comment[]> {
    return this.commentsService.findAllByHoagie(hoagieId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Comment> {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: Partial<Comment>,
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const userId = req.user._id.toString();
    const commentUserId = comment.user._id.toString();
    if (commentUserId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Comment> {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const userId = req.user._id.toString();
    const commentUserId = comment.user._id.toString();
    if (commentUserId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const removedComment = await this.commentsService.remove(id);

    if (!removedComment) {
      throw new NotFoundException('Comment not found');
    }
    return removedComment;
  }
}
