import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetSystemUserDto } from './dto/get-system-user.dto';
import { encrypt } from '../utils/crypto';
import { RolesService } from 'src/role/role.service';
import { SystemUser } from './entities/ststem-user.entity';
import { CreateSystemUserDto } from './dto/create-ststem-user.dto';
import { conditionUtilsSelect } from 'src/utils/db.help';
import { Menu } from 'src/menu/entities/menu.entity';
import { ChangeSystemUserPasswordDto, UpdateSystemUserDto } from './dto/update-ststem-user.dto';

@Injectable()
export class SystemUserService {
  constructor(
    private readonly rolesService: RolesService,
    @InjectRepository(SystemUser)
    private systemUserRepository: Repository<SystemUser>,
  ) {}

  async create(createSystemUserDto: CreateSystemUserDto) {
    const list = await this.rolesService.returnRolesServiceEntities(createSystemUserDto.roleIds);
    createSystemUserDto.roles = list;
    // 加密
    createSystemUserDto.password = encrypt(createSystemUserDto.password ? createSystemUserDto.password : '123456');
    const res = await this.systemUserRepository.save(createSystemUserDto);
    delete res.roleIds;
    return res;
  }

  async findAll(query: GetSystemUserDto) {
    const { page, limit, name } = query;
    const conditions = [{ field: 'name', value: name }];
    const queryBuilder = await this.systemUserRepository.createQueryBuilder('system_user');

    const newQueryBuilder = conditionUtilsSelect<SystemUser>(queryBuilder, conditions, 'system_user');
    const count = await newQueryBuilder.getCount();
    const content = await newQueryBuilder
      .leftJoinAndSelect('system_user.roles', 'role')
      // .select(['system_user', 'role.id'])
      .skip((page - 1) * limit || 0)
      .take(limit || 10)
      .getMany();

    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findDetail(id: number) {
    const res = await this.systemUserRepository
      .createQueryBuilder('system_user')
      .leftJoinAndMapMany('system_user.roles', 'system_user.roles', 'role')
      .leftJoinAndMapMany('role.menus', 'role.menus', 'menus')
      .andWhere('system_user.id = :userId', { userId: id })
      .getOne();

    if (!res) {
      throw new ForbiddenException('用户不存在');
    }
    const menus: Menu[] = [];
    res.roles.map(item => {
      if (item.menus.length) {
        menus.push(...item.menus);
      }
    });
    // 角色
    const roles: { id: number; name: string }[] = res.roles.map(item => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    // 按钮权限
    const buttonList: string[] = [];
    menus.map(item => {
      if (item.nodeType === 3) {
        buttonList.push(item.menuCode);
      }
    });
    // 菜单列表
    // let menusList: any = [];
    // menusList = menuTree(menus, 0);
    return {
      userInForm: await this.findOne(id),
      roles,
      buttonList,
      // menusList,
    };
  }

  async update(id: number, updateSystemUserDto: UpdateSystemUserDto) {
    const res = await this.findOne(id);
    if (!res.id) {
      throw new ForbiddenException('用户不存在');
    }
    const list = await this.rolesService.returnRolesServiceEntities(updateSystemUserDto.roleIds);
    updateSystemUserDto.roles = list;
    const tes = await this.systemUserRepository.merge(res, updateSystemUserDto);
    return this.systemUserRepository.save(tes);
  }

  async updatePassword(id: number, updateSystemUserDto: ChangeSystemUserPasswordDto) {
    const res = await this.findOne(id);
    if (!res.id) {
      throw new ForbiddenException('用户不存在');
    }
    const oldPassword = encrypt(updateSystemUserDto.oldPassword);
    if (oldPassword !== res.password) {
      throw new BadRequestException('旧密码不正确');
    }
    const changeRes = await this.systemUserRepository
      .createQueryBuilder('system_user')
      .update(SystemUser)
      .set({ password: encrypt(updateSystemUserDto.newPassword) })
      .where({ id })
      .execute();
    if (changeRes.affected) {
      return '修改成功';
    }
  }

  findOne(id: number) {
    return this.systemUserRepository.findOne({ where: { id } });
  }

  // 根据账号密码查询系统用户
  async loginSystemUser(username: string, password: string) {
    return this.systemUserRepository.findOne({
      relations: ['roles'],
      where: { name: username, password: encrypt(password) },
    });
  }
}
