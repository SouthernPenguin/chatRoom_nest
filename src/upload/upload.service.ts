import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import redConfigFile from 'src/utils/redConfigFile';

const configYml: any = redConfigFile();

@Injectable()
export class UploadService {
  constructor(private userService: UserService) {}

  async upLoadUserImageSave(id: number, file: Express.Multer.File) {
    const res = await this.userService.findOne(id);
    if (res?.id) {
      res.headerImg = `${configYml.PREFIX}${file.filename}`;
      return this.userService.update(id, res);
    }
    return '';
  }
}
