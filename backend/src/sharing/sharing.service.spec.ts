import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SharingService } from './sharing.service';

describe('SharingService', () => {
  it('does not allow a user to request sharing of their own member', async () => {
    const prisma = {
      familyMember: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'member-id',
          userId: 'user-id',
          isAlive: false,
        }),
      },
      shareRequest: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      memberShareConsent: { findUnique: jest.fn() },
      userSettings: { findUnique: jest.fn() },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.createShareRequest('user-id', { targetMemberId: 'member-id' }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.shareRequest.create).not.toHaveBeenCalled();
  });

  it('does not allow a request for a living member', async () => {
    const prisma = {
      familyMember: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'member-id',
          userId: 'owner-id',
          isAlive: true,
        }),
      },
      shareRequest: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      memberShareConsent: { findUnique: jest.fn() },
      userSettings: { findUnique: jest.fn() },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.createShareRequest('requester-id', { targetMemberId: 'member-id' }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.shareRequest.create).not.toHaveBeenCalled();
  });

  it('does not allow a request for a member hidden from discovery', async () => {
    const prisma = {
      familyMember: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'member-id',
          userId: 'owner-id',
          isAlive: false,
        }),
      },
      shareRequest: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      memberShareConsent: {
        findUnique: jest.fn().mockResolvedValue({ allowDiscovery: false }),
      },
      userSettings: { findUnique: jest.fn() },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.createShareRequest('requester-id', { targetMemberId: 'member-id' }),
    ).rejects.toThrow(ForbiddenException);

    expect(prisma.shareRequest.create).not.toHaveBeenCalled();
  });
});
