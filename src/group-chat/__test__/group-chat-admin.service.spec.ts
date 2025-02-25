import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatAdminService } from '../group-chat-admin/group-chat-admin.service';

describe('GroupChatAdminService', () => {
  let service: GroupChatAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupChatAdminService],
    }).compile();

    service = module.get<GroupChatAdminService>(GroupChatAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
