import { Test, TestingModule } from '@nestjs/testing';
import { SummaryMessageController } from '../summary-message.controller';
import { SummaryMessageService } from '../summary-message.service';

describe('SummaryMessageController', () => {
  let controller: SummaryMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryMessageController],
      providers: [SummaryMessageService],
    }).compile();

    controller = module.get<SummaryMessageController>(SummaryMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
