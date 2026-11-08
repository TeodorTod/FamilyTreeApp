import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const usersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  validatePassword: jest.fn(),
  toPublicUser: jest.fn(),
};
const jwtService = { sign: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    usersService.findByEmail.mockReset();
    usersService.findById.mockReset();
    usersService.validatePassword.mockReset();
    usersService.toPublicUser.mockReset();
    jwtService.sign.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: { passwordResetToken: {} } },
        { provide: MailerService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('does not validate a password when the account does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.validateUser('missing@example.com', 'password'),
    ).resolves.toBeNull();

    expect(usersService.validatePassword).not.toHaveBeenCalled();
    expect(usersService.toPublicUser).not.toHaveBeenCalled();
  });

  it('returns the sanitized user after valid credentials', async () => {
    const user = { id: 'user-id', email: 'person@example.com' };
    const safeUser = { ...user, hasPassword: true, isAdmin: false };
    usersService.findByEmail.mockResolvedValue(user);
    usersService.validatePassword.mockResolvedValue(true);
    usersService.toPublicUser.mockReturnValue(safeUser);

    await expect(
      service.validateUser(user.email, 'correct-password'),
    ).resolves.toEqual(safeUser);

    expect(usersService.validatePassword).toHaveBeenCalledWith(
      user,
      'correct-password',
    );
    expect(usersService.toPublicUser).toHaveBeenCalledWith(user);
  });

  it('does not expose a user after an invalid password', async () => {
    const user = { id: 'user-id', email: 'person@example.com' };
    usersService.findByEmail.mockResolvedValue(user);
    usersService.validatePassword.mockResolvedValue(false);

    await expect(
      service.validateUser(user.email, 'wrong-password'),
    ).resolves.toBeNull();

    expect(usersService.toPublicUser).not.toHaveBeenCalled();
  });

  it('uses the authenticated user when a fresh lookup no longer finds it', async () => {
    const user = { id: 'user-id', email: 'person@example.com' };
    const safeUser = { ...user, hasPassword: true, isAdmin: false };
    usersService.findById.mockResolvedValue(null);
    usersService.toPublicUser.mockReturnValue(safeUser);
    jwtService.sign.mockReturnValue('access-token');

    await expect(service.login(user)).resolves.toEqual({
      access_token: 'access-token',
      user: safeUser,
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: user.id,
    });
    expect(usersService.toPublicUser).toHaveBeenCalledWith(user);
  });
});
