import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleEntity } from '../../../../core/entities';
import { RoleException } from '../../../../core/entities/employee/role/exception';
import { PagingDto } from '../../../../core/validation/dtos/paging.dto';
import { DatabaseService } from '../../base.repository';
import { Role, RoleDocument } from '../../model/role/role.model';
import { IRoleRepository } from './interface';

export class RoleRepository extends DatabaseService<RoleDocument> implements IRoleRepository<RoleEntity> {

  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {
    super(model);
  }


  public async createRole(data: RoleEntity): Promise<RoleEntity> {

    const result = await this.create<RoleEntity>(data);

    return result;

  }


  public async updateRole(id: string, data: RoleEntity): Promise<RoleEntity> {

    const query = {
      isDeletd: false,
      _id: id
    }

    const result = await this.updateByQuery<RoleEntity>(query, data);

    return result;
  }


  public async getRolePaging(dto: PagingDto): Promise<{ total: number, data: any }> {
    try {

      const query: any = { isDeleted: false };

      const $projection = {
        $project: {
          __v: 0,
          createdBy: 0,
          updatedBy: 0,
          deletedBy: 0
        },
      };

      const $pipline = [$projection];

      return await this.findPaging(query, dto, $pipline);

    } catch (error) {
      console.log("error paging role: ", error);
      throw new Error(error)
    }
  }


  public async getRole(id: string): Promise<RoleEntity> {

    try {

      const $match: any = {
        $match: {
          _id: new Types.ObjectId(id),
          isDeleted: false
        },
      };


      const $projection = {
        $project: {
          __v: 0,
          createdBy: 0,
          updatedBy: 0,
          deletedBy: 0
        },
      };

      const $pipline = [$match, $projection];

      const data = await this.aggregate($pipline);

      if (!data || !data[0]) throw RoleException.NotFound(id)

      return data[0];

    } catch (error) {
      throw RoleException.UnknownError(error);
    }
  }


  public async markDeleteRole(id: string): Promise<string> {

    await this.markAsDeleted(id);

    return id;

  }

  public async hasAccess(id: string, access: string): Promise<any> {
    console.log("roleId: ", id);
    const role = await this.findById(id);
    if (!role[access] || role.isDeleted) throw RoleException.NotEnoughPermission({ id, access });
  }


}
