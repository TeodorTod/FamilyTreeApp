import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FamilyMembersService } from './family-members.service';

describe('FamilyMembersService', () => {
  it('does not allow a child to have two fathers', async () => {
    const prisma = {
      familyMember: {
        findFirst: jest
          .fn()
          .mockResolvedValueOnce({ id: 'father-id', role: 'father' })
          .mockResolvedValueOnce({
            id: 'child-id',
            role: 'child',
            firstName: 'Alex',
            lastName: 'Doe',
          }),
      },
      relationship: {
        findMany: jest.fn().mockResolvedValue([
          { fromMember: { role: 'father' } },
        ]),
        create: jest.fn(),
      },
    };
    const service = new FamilyMembersService(
      prisma as unknown as PrismaService,
    );

    await expect(
      service.createRelationship('user-id', {
        fromMemberId: 'father-id',
        toMemberId: 'child-id',
        type: 'parent',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.relationship.create).not.toHaveBeenCalled();
  });

  it('does not allow a child to have two mother role variants', async () => {
    const prisma = {
      familyMember: {
        findFirst: jest
          .fn()
          .mockResolvedValueOnce({ id: 'mother-id', role: 'step_mother' })
          .mockResolvedValueOnce({
            id: 'child-id',
            role: 'child',
            firstName: 'Alex',
            lastName: 'Doe',
          }),
      },
      relationship: {
        findMany: jest.fn().mockResolvedValue([
          { fromMember: { role: 'mother' } },
        ]),
        create: jest.fn(),
      },
    };
    const service = new FamilyMembersService(
      prisma as unknown as PrismaService,
    );

    await expect(
      service.createRelationship('user-id', {
        fromMemberId: 'mother-id',
        toMemberId: 'child-id',
        type: 'parent',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.relationship.create).not.toHaveBeenCalled();
  });

  it('creates a parent relationship when that parent role is available', async () => {
    const relationship = { id: 'relationship-id' };
    const prisma = {
      familyMember: {
        findFirst: jest
          .fn()
          .mockResolvedValueOnce({ id: 'father-id', role: 'father' })
          .mockResolvedValueOnce({
            id: 'child-id',
            role: 'child',
            firstName: 'Alex',
            lastName: 'Doe',
          }),
      },
      relationship: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue(relationship),
      },
    };
    const service = new FamilyMembersService(
      prisma as unknown as PrismaService,
    );

    await expect(
      service.createRelationship('user-id', {
        fromMemberId: 'father-id',
        toMemberId: 'child-id',
        type: 'parent',
      }),
    ).resolves.toEqual(relationship);

    expect(prisma.relationship.create).toHaveBeenCalledWith({
      data: {
        fromMemberId: 'father-id',
        toMemberId: 'child-id',
        type: 'parent',
      },
    });
  });

  it('does not create a relationship with a member outside the user tree', async () => {
    const prisma = {
      familyMember: {
        findFirst: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ id: 'child-id', role: 'child' }),
      },
      relationship: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    };
    const service = new FamilyMembersService(
      prisma as unknown as PrismaService,
    );

    await expect(
      service.createRelationship('user-id', {
        fromMemberId: 'foreign-member-id',
        toMemberId: 'child-id',
        type: 'parent',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(prisma.relationship.create).not.toHaveBeenCalled();
  });

  it('does not change the role of a member outside the user tree', async () => {
    const prisma = {
      familyMember: {
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
      },
    };
    const service = new FamilyMembersService(
      prisma as unknown as PrismaService,
    );

    await expect(
      service.assignMemberRole('user-id', 'foreign-member-id', 'father'),
    ).rejects.toThrow(NotFoundException);

    expect(prisma.familyMember.update).not.toHaveBeenCalled();
  });
});
