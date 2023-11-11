import { Injectable } from '@nestjs/common';
import { CreateWDto } from './dto/create-w.dto';
import { UpdateWDto } from './dto/update-w.dto';

@Injectable()
export class WsService {
  create(createWDto: CreateWDto) {
    return [{ id: 1 }];
  }

  findAll() {
    return `This action returns all ws`;
  }

  findOne(id: number) {
    return id;
  }

  update(id: number, updateWDto: UpdateWDto) {
    return `This action updates a #${id} w`;
  }

  remove(id: number) {
    return `This action removes a #${id} w`;
  }
}
