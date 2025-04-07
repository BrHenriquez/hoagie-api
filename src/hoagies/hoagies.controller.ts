import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HoagiesService } from './hoagies.service';
import { Hoagie } from './schemas/hoagie.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../core/decorators/current-user.decorator';
import { UnauthorizedException } from '@nestjs/common';

@Controller('hoagies')
export class HoagiesController {
  constructor(private readonly hoagiesService: HoagiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body()
    createHoagieDto: { name: string; ingredients: string[]; picture?: string },
    @Req() req: RequestWithUser,
  ): Promise<Hoagie> {
    console.log('createHoagieDto', createHoagieDto, req);
    return this.hoagiesService.create({
      ...createHoagieDto,
      creator: req.user._id,
    });
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{ data: Hoagie[]; total: number }> {
    return this.hoagiesService.findAll(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Hoagie> {
    return this.hoagiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateHoagieDto: Partial<Hoagie>,
    @Req() req: RequestWithUser,
  ): Promise<Hoagie> {
    // Verify that the user is the creator or a collaborator
    const hoagie = await this.hoagiesService.findOne(id);
    if (
      hoagie.creator._id.toString() !== req.user._id.toString() &&
      !hoagie.collaborators.some(
        (c) => c._id.toString() === req.user._id.toString(),
      )
    ) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.hoagiesService.update(id, updateHoagieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Hoagie> {
    // Verify that the user is the creator
    const hoagie = await this.hoagiesService.findOne(id);
    const creatorId = hoagie.creator._id.toString();
    const userId = req.user._id.toString();

    if (creatorId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.hoagiesService.remove(id);
  }

  @Post(':id/collaborators')
  @UseGuards(JwtAuthGuard)
  async addCollaborator(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Req() req: RequestWithUser,
  ): Promise<Hoagie> {
    // Verify that the user is the creator
    const hoagie = await this.hoagiesService.findOne(id);
    if (hoagie.creator?._id.toString() !== req.user._id.toString()) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.hoagiesService.addCollaborator(id, userId);
  }

  @Delete(':id/collaborators/:userId')
  @UseGuards(JwtAuthGuard)
  async removeCollaborator(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: RequestWithUser,
  ): Promise<Hoagie> {
    // Verify that the user is the creator
    const hoagie = await this.hoagiesService.findOne(id);
    if (hoagie.creator._id.toString() !== req.user._id.toString()) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.hoagiesService.removeCollaborator(id, userId);
  }
}
