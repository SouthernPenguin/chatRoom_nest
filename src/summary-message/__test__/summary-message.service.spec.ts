import { Test, TestingModule } from '@nestjs/testing';
import { SummaryMessageService } from '../summary-message.service';

describe('SummaryMessageService', () => {
  let service: SummaryMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummaryMessageService],
    }).compile();

    service = module.get<SummaryMessageService>(SummaryMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
