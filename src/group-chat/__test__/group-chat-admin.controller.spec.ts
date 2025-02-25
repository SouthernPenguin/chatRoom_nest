import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatAdminController } from '../group-chat-admin/group-chat-admin.controller';

describe('GroupChatAdminController', () => {
  let controller: GroupChatAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupChatAdminController],
    }).compile();

    controller = module.get<GroupChatAdminController>(GroupChatAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
