import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Role } from 'src/role/entities/role.entity';
import { menuTree } from 'src/utils';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const find = await this.menuRepository.findOne({
      where: { name: createMenuDto.name },
    });
    if (find?.id) {
      throw new BadRequestException('菜单名称重复');
    }
    return this.menuRepository.save(createMenuDto);
  }

  async findAll(
    roleId: number[],
    isTree: boolean = false,
    isAdmin: boolean = false,
  ) {
    let res = null;

    if (isAdmin) {
      res = await this.menuRepository.find();
    } else {
      res = await this.roleRepository.findOne({
        where: {
          id: In(roleId),
        },
        relations: ['menus'],
      });
    }

    const filterMenu = isAdmin
      ? res.filter((i) => !i.isDeleted)
      : res.menus.filter((i) => !i.isDeleted);

    if (isTree) {
      return menuTree(filterMenu, 0);
    } else {
      return filterMenu;
    }
  }

  findChildren(id: number) {
    return this.menuRepository.find({
      where: { parentId: id, isDeleted: IsNull() },
      order: {
        sort: 'ASC',
      },
    });
  }

  // 一级菜单
  async findFirstStage() {
    const res = await this.menuRepository.query(
      `
      SELECT
        t1.*,
      CASE
          WHEN EXISTS ( SELECT 1 FROM menu t2 WHERE t2.parentId = t1.id ) THEN
          ${true} ELSE ${false}
        END AS hasChildren 
      FROM
        menu t1 
      WHERE
        t1.nodeType = ? AND ISNULL(isDeleted)
      ORDER BY
        sort asc;
      `,
      [0],
    );
    return res;
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
    const r = await this.menuRepository.save(newMenu);
    if (r.id) {
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
