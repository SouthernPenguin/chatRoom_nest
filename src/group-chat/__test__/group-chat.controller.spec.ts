import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatController } from '../group-chat.controller';
import { GroupChatService } from '../group-chat.service';

describe('GroupChatController', () => {
  let controller: GroupChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupChatController],
      providers: [GroupChatService],
    }).compile();

    controller = module.get<GroupChatController>(GroupChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
