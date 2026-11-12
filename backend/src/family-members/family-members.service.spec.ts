import { BadRequestException } from '@nestjs/common';
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
});
