import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SharingService } from './sharing.service';

describe('SharingService', () => {
  it('rejects a decision for a missing request', async () => {
    const prisma = {
      shareRequest: {
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
      },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.decide('owner-id', 'missing-request-id', 'APPROVED'),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.shareRequest.update).not.toHaveBeenCalled();
  });

  it('rejects a decision on an already decided request', async () => {
    const prisma = {
      shareRequest: {
        findUnique: jest.fn().mockResolvedValue({
          status: 'REJECTED',
          target: { userId: 'owner-id' },
        }),
        update: jest.fn(),
      },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.decide('owner-id', 'request-id', 'APPROVED'),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.shareRequest.update).not.toHaveBeenCalled();
  });

  it('rejects a share decision by someone other than the member owner', async () => {
    const prisma = {
      shareRequest: {
        findUnique: jest.fn().mockResolvedValue({
          status: 'PENDING',
          target: { userId: 'owner-id' },
        }),
        update: jest.fn(),
      },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.decide('other-user-id', 'request-id', 'APPROVED'),
    ).rejects.toThrow(ForbiddenException);
    expect(prisma.shareRequest.update).not.toHaveBeenCalled();
  });

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

  it('does not create a duplicate active share request', async () => {
    const prisma = {
      familyMember: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'member-id',
          userId: 'owner-id',
          isAlive: false,
        }),
      },
      shareRequest: {
        findFirst: jest.fn().mockResolvedValue({ id: 'request-id' }),
        create: jest.fn(),
      },
      memberShareConsent: { findUnique: jest.fn() },
      userSettings: {
        findUnique: jest.fn().mockResolvedValue({
          allowDeceasedDiscoveryDefault: true,
        }),
      },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.createShareRequest('requester-id', { targetMemberId: 'member-id' }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.shareRequest.create).not.toHaveBeenCalled();
  });

  it('creates a pending request for a discoverable deceased member', async () => {
    const request = { id: 'request-id' };
    const prisma = {
      familyMember: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'member-id',
          userId: 'owner-id',
          isAlive: false,
        }),
      },
      shareRequest: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(request),
      },
      memberShareConsent: { findUnique: jest.fn() },
      userSettings: {
        findUnique: jest.fn().mockResolvedValue({
          allowDeceasedDiscoveryDefault: true,
        }),
      },
    };
    const service = new SharingService(prisma as unknown as PrismaService);

    await expect(
      service.createShareRequest('requester-id', {
        targetMemberId: 'member-id',
        message: 'Please share this profile.',
      }),
    ).resolves.toEqual(request);

    expect(prisma.shareRequest.create).toHaveBeenCalledWith({
      data: {
        requesterUserId: 'requester-id',
        targetMemberId: 'member-id',
        message: 'Please share this profile.',
        status: 'PENDING',
      },
    });
  });
});
