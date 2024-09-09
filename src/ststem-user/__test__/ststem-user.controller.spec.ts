import { Test, TestingModule } from '@nestjs/testing';
import { StstemUserController } from '../ststem-user.controller';
import { StstemUserService } from '../ststem-user.service';

describe('StstemUserController', () => {
  let controller: StstemUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StstemUserController],
      providers: [StstemUserService],
    }).compile();

    controller = module.get<StstemUserController>(StstemUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
