import { Test, TestingModule } from '@nestjs/testing';
import { StstemUserService } from '../ststem-user.service';

describe('StstemUserService', () => {
  let service: StstemUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StstemUserService],
    }).compile();

    service = module.get<StstemUserService>(StstemUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
