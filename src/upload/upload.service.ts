import { Injectable } from '@nestjs/common';
import { ChatType } from 'src/enum';
import { CreateGroupMessageDto } from 'src/group-message/dto/create-group-message.dto';
import { GroupMessageService } from 'src/group-message/group-message.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';
import { formatFileSize } from 'src/utils';
import redConfigFile from 'src/utils/redConfigFile';

const configYml: any = redConfigFile();

@Injectable()
export class UploadService {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private groupMessageService: GroupMessageService,
  ) {}

  async upLoadUserImageSave(id: number, file: Express.Multer.File) {
    // 上传后实际路径
    const afterUploadingPath = file.path.split('uploadFiles')[1].replace(/\\/g, '/');
    if (id) {
      const res = await this.userService.findOne(id);
      if (res?.id) {
        res.headerImg = `http://127.0.0.1:${configYml.PORT}${configYml.PREFIX}${afterUploadingPath}`;
        return this.userService.update(id, res);
      }
    }

    // 如果没有找到用户，返回空字符串
    return `http://127.0.0.1:${configYml.PORT}${configYml.PREFIX}${afterUploadingPath}`;
  }

  async messageFileSave(toUserId: number, fromUserId: number, file: Express.Multer.File, msgType: ChatType) {
    const afterUploadingPath = file.path.split('uploadFiles')[1].replace(/\\/g, '/');
    const postMessage = `http://127.0.0.1:${configYml.PORT}${configYml.PREFIX}${afterUploadingPath}`;
    if (msgType === ChatType.私聊) {
      const dto = {
        postMessage,
        fromUserId,
        toUserId,
        fileType: file.filename.split('.')[file.filename.split('.').length - 1],
        fileSize: formatFileSize(file.size),
        msgType: ChatType.私聊,
        originalFileName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      } as CreateMessageDto;

      return await this.messageService.create(dto);
    }

    if (msgType === ChatType.群聊) {
      const dto = {
        groupId: toUserId,
        fromUserId,
        postMessage,
        fileType: file.filename.split('.')[file.filename.split('.').length - 1],
        fileSize: formatFileSize(file.size),
        msgType: ChatType.群聊,
        originalFileName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      } as CreateGroupMessageDto;
      const userInform = await this.userService.findOne(dto.fromUserId);
      dto['fromUser'] = userInform;

      return await this.groupMessageService.create(dto);
    }
  }
}
