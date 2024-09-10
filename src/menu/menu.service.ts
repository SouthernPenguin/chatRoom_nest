import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { menuTree } from '../utils';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    return this.menuRepository.save(createMenuDto);
  }

  async findAll(roleId: number[]) {
    const res = await this.roleRepository.findOne({
      where: {
        id: In(roleId),
      },
      relations: ['menus'],
    });

    return menuTree(
      res.menus.filter((i) => !i.isDeleted),
      0,
    );
  }

  findChildren(id: number) {
    return this.menuRepository.find({ where: { parentId: id } });
  }

  findOne(id: number) {
    return this.menuRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMenuDto: CreateMenuDto) {
    const menuRes = await this.findOne(id);
    if (!menuRes?.id) {
      throw new ForbiddenException('菜单不存在');
    }
    const newMenu = this.menuRepository.merge(menuRes, updateMenuDto);

    return this.menuRepository.save(newMenu);
  }

  async remove(id: number) {
    const menuRes = await this.findOne(id);
    if (!menuRes?.id) {
      throw new ForbiddenException('菜单不存在');
    }
    menuRes.isDeleted = true;
    const newMenu = await this.menuRepository.merge(menuRes);
    this.menuRepository.save(newMenu);
    if (newMenu.id) {
      return {};
    }
  }

  // 返回menus实体
  async returnMenusEntities(ids: number[]) {
    return await this.menuRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
