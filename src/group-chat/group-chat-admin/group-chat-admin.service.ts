import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from '../entities/group-chat.entity';
import { Repository } from 'typeorm';
import { ListSearchDto } from '../dto/list-search.dto';
import { conditionUtilsLike, conditionUtilsSelect } from 'src/utils/db.help';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GroupChatAdminService {
  constructor(
    @InjectRepository(GroupChat)
    private groupChatRepository: Repository<GroupChat>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async selectGroupChatList(query: ListSearchDto) {
    const { page, limit, blurry } = query;

    const conditions = [{ field: 'name', value: blurry }];

    const queryBuilder = this.groupChatRepository.createQueryBuilder('group_chat');

    try {
      const newQueryBuilder = conditionUtilsLike<GroupChat>(queryBuilder, conditions, 'group_chat');

      const count = await newQueryBuilder.getCount();
      const content = await newQueryBuilder
        .skip((page - 1) * limit || 0)
        .take(limit || 10)
        .getMany();
      return {
        content: content,
        totalElements: count,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async selectGroupChatPeoples(id: number) {
    const queryBuilder = this.userRepository.createQueryBuilder(`user`);
    queryBuilder.leftJoin('group_chat_user', 'group_chat_user', 'group_chat_user.userId = `user`.id');
    queryBuilder.where('group_chat_user.groupChatId = :id', { id });
    return await queryBuilder.getMany();
  }

  async deleteGroupChat(id: number) {
    const res = await this.groupChatRepository.delete(id);
    if (res.affected == 0) {
      throw new BadRequestException('删除失败 ');
    } else {
      return '删除成功';
    }
  }
}
