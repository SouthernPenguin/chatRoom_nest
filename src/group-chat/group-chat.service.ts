import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { Repository } from 'typeorm';
import { UserAuthService } from 'src/user/userAuth.service';
import { GroupChatUserService } from './group-chat-user.service';

@Injectable()
export class GroupChatService {
  constructor(
    private userAuthService: UserAuthService,
    @InjectRepository(GroupChat)
    private groupChatRepository: Repository<GroupChat>,

    private groupChatUserRepository: GroupChatUserService,
  ) {}

  async create(userId: number, createGroupChatDto: CreateGroupChatDto) {
    const userList = await this.userAuthService.selectAllUser([...createGroupChatDto.userIds, userId]);
    const userList1 = await this.userAuthService.selectAllUser([userId]);
    createGroupChatDto.users = userList;
    createGroupChatDto.createdUserId = userList1[0];
    const res = this.groupChatRepository.create(createGroupChatDto);
    return this.groupChatRepository.save(res);
  }

  async findAll(userId: number) {
    return await this.groupChatRepository
      .createQueryBuilder('group_chat')
      .select(['group_chat.id', 'group_chat.name'])
      .leftJoinAndSelect('group_chat.users', 'users')
      .leftJoinAndSelect('group_chat.createdUserId', 'createdUser')
      .where('group_chat.createdUserId = :userId', {
        userId,
      })
      .orWhere('users.id = :userId', { userId })
      .getMany();
  }

  async findOne(id: number) {
    const groupChatRes = await this.groupChatRepository
      .createQueryBuilder('group_chat')
      .leftJoinAndSelect('group_chat.createdUserId', 'createdUser')
      .where('group_chat.id = :id', {
        id,
      })
      .getOne();

    const res = await this.groupChatUserRepository.findOne(id);

    const selectUser = await this.userAuthService.selectAllUser(res.map(item => item.userId));

    res.map(item => {
      item['userInform'] = selectUser.filter(user => user.id == item.userId)[0];
      item['GroupLeader'] = item.userId == groupChatRes.createdUserId.id;
    });
    return res;
  }

  async update(id: number, updateGroupChatDto: UpdateGroupChatDto) {
    const res = await this.groupChatRepository.findOne({
      where: {
        id,
      },
    });
    if (!res?.id) {
      throw new BadRequestException('只有群主有权限修改群名与公告');
    }
    return await this.groupChatRepository
      .createQueryBuilder('message')
      .update(GroupChat)
      .set({ name: updateGroupChatDto.name, notice: updateGroupChatDto.notice })
      .where('id = :id', { id })
      .execute();
  }

  remove(id: number) {
    return `This action removes a #${id} groupChat`;
  }
}
