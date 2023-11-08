import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';
import redConfigFile from 'src/utils/redConfigFile';

const configYml: any = redConfigFile();

@Injectable()
export class UploadService {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  async upLoadUserImageSave(id: number, file: Express.Multer.File) {
    const res = await this.userService.findOne(id);
    if (res?.id) {
      res.headerImg = `${configYml.PREFIX}${file.filename}`;
      return this.userService.update(id, res);
    }
    return '';
  }

  async messageFileSave(
    toUserId: number,
    fromUserId: number,
    file: Express.Multer.File,
  ) {
    const postMessage = `${configYml.PREFIX}${file.filename}`;
    const dto = {
      postMessage,
      fromUserId,
      toUserId,
      fileType: file.filename.split('.')[file.filename.split('.').length - 1],
    } as CreateMessageDto;

    return await this.messageService.create(dto);
  }
}
