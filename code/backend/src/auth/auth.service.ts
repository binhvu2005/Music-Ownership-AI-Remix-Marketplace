import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/** Cost factor for bcrypt hashing — 12 rounds for production security */
const BCRYPT_SALT_ROUNDS = 12;

/** Fields to exclude when returning user data to the client */
export type SafeUser = Omit<{
  id: string;
  email: string;
  role: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}, never>;

export interface AuthResponse {
  access_token: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user with email/password.
   * - Checks for duplicate email
   * - Hashes password with bcrypt (cost 12)
   * - Assigns default role 'consumer'
   * - Returns JWT access_token + sanitized user
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    // Create user with default role
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
        role: 'consumer',
      },
    });

    // Generate JWT
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: accessToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Authenticate user with email/password.
   * - Validates email exists
   * - Checks password hash is set (not OAuth-only)
   * - Checks account is not banned
   * - Compares password with bcrypt
   * - Returns JWT access_token + sanitized user
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has a password (not OAuth-only account)
    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is banned
    if (user.isBanned) {
      throw new UnauthorizedException('Account has been suspended');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: accessToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Get authenticated user's profile by ID.
   */
  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Remove sensitive fields (passwordHash) from user object.
   */
  private sanitizeUser(user: Record<string, unknown>): SafeUser {
    const { passwordHash: _removed, ...safeUser } = user as Record<string, unknown> & { passwordHash?: string };
    return safeUser as unknown as SafeUser;
  }
}
