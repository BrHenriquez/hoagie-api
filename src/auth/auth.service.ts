import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { User } from "src/users/schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User> | null> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user?.password) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      return user.toObject() as Partial<User>;
    } catch (error) {
      console.error(`Error validating user: ${error.message}`, error.stack);

      if (error instanceof UnauthorizedException) {
        throw error;
      }
      return null;
    }
  }

  login(user: Partial<User>): { access_token: string; user: Partial<User> } {
    try {
      const payload = { email: user.email, sub: user._id };
      const access_token = this.jwtService.sign(payload);

      if (!user.name || !user.email || !user._id || !access_token) {
        throw new UnauthorizedException("Invalid credentials");
      }

      return {
        access_token,
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      };
    } catch (error) {
      console.error(`Error logging in: ${error.message}`, error.stack);
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  async register(createUserDto: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ access_token: string; user: Partial<User> }> {
    try {
      const user = await this.usersService.create(createUserDto);

      return this.login(user);
    } catch (error) {
      console.error(`Error registering user: ${error.message}`, error.stack);
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
