import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { MenusService } from 'src/menu/menu.service';
import { GetRoleDto } from './dto/get-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly menusService: MenusService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const list = await this.menusService.returnMenusEntities(
      createRoleDto.menuIds,
    );
    createRoleDto.menus = list;
    const res = await this.roleRepository.save(createRoleDto);
    delete res.menuIds;
    return res;
  }

  async findAll(query: GetRoleDto) {
    const { page, limit, name } = query;
    let queryBuilder = await this.roleRepository.createQueryBuilder('role');
    if (name) {
      queryBuilder = queryBuilder.where('role.name LIKE :searchTerm', {
        searchTerm: `%${name}%`,
      });
    }
    const count = await queryBuilder.getCount();
    const content = await queryBuilder
      .skip((page - 1) * limit || 0)
      .take(limit || 10)
      .getMany();
    return {
      content,
      totalElements: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['menus'],
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const rolesRes = await this.findOne(id);
    if (!rolesRes.id) {
      throw new ForbiddenException('角色不存在');
    }
    const list = await this.menusService.returnMenusEntities(
      updateRoleDto.menuIds,
    );
    updateRoleDto.menus = list;
    const newRolesRes = Object.assign(rolesRes, updateRoleDto);
    return this.roleRepository.save(newRolesRes);
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  //  返回Roles 实体集合
  async returnRolesServiceEntities(ids: number[]) {
    return await this.roleRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
