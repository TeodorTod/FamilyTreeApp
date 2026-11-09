import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: { user: {} } },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a public user without exposing the password', () => {
    expect(
      service.toPublicUser({
        id: 'user-id',
        email: 'person@example.com',
        password: 'hashed-password',
        isAdmin: null,
      }),
    ).toEqual({
      id: 'user-id',
      email: 'person@example.com',
      hasPassword: true,
      isAdmin: false,
    });
  });

  it('returns null for a missing user', () => {
    expect(service.toPublicUser(null)).toBeNull();
  });

  it('preserves administrator status without a password', () => {
    expect(
      service.toPublicUser({
        id: 'admin-id',
        password: null,
        isAdmin: true,
      }),
    ).toEqual({
      id: 'admin-id',
      hasPassword: false,
      isAdmin: true,
    });
  });

  it('rejects password validation when password login is unavailable', async () => {
    await expect(
      service.validatePassword({ password: null }, 'password'),
    ).resolves.toBe(false);
  });
});
