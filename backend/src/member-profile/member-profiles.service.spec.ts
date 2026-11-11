import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberProfilesService } from './member-profiles.service';

describe('MemberProfilesService', () => {
  it('does not return a profile owned by another user', async () => {
    const prisma = {
      familyMember: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'member-id',
          userId: 'owner-id',
        }),
      },
      memberProfile: {
        findUnique: jest.fn(),
      },
    };
    const service = new MemberProfilesService(
      prisma as unknown as PrismaService,
    );

    await expect(
      service.getByMemberId('other-user-id', 'member-id'),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.memberProfile.findUnique).not.toHaveBeenCalled();
  });
});
