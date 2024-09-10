import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateMenuDto } from '../../dto/create-menu.dto';

/**
 * 第一级 parent_id 默认赋值0
 */
@Injectable()
export class CreateMenuDtoPipe implements PipeTransform {
  transform(value: CreateMenuDto, metadata: ArgumentMetadata) {
    if (!value.parentId) {
      value.parentId = 0;
    }
    value['is_deleted'] = 0;
    return value;
  }
}
