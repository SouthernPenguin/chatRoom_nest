import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatUserService } from './group-chat-user.service';

describe('GroupChatUserService', () => {
  let service: GroupChatUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupChatUserService],
    }).compile();

    service = module.get<GroupChatUserService>(GroupChatUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
