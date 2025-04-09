import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() createUserDto: { name: string; email: string; password: string },
  ) {
    const user = await this.authService.register(createUserDto);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  @Post("login")
  async login(@Body() loginDto: { email: string; password: string }) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException("Email and password are required");
    }
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user);
  }
}
