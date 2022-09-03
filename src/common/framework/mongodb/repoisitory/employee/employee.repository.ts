import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { COLLECTIONS } from '../../../../constant/collection';
import { EmployeeException } from '../../../../constant/exceptions';
import { EmployeeEntity } from '../../../../core/entities';
import { PagingDto } from '../../../../core/validation/dtos/paging.dto';
import { DatabaseService } from '../../base.repository';
import { Employee, EmployeeDocument } from './../../model/employee/employee.model';
import { IEmployeeRepository } from './interface';

export class EmployeeRepository extends DatabaseService<EmployeeDocument> implements IEmployeeRepository<EmployeeEntity> {

  constructor(@InjectModel(Employee.name) private readonly model: Model<EmployeeDocument>) {
    super(model);
  }


  public async updateEmployee(id: string, data: EmployeeEntity): Promise<EmployeeEntity> {

    const query = {
      isDeletd: false,
      _id: id
    }

    const result = await this.updateByQuery<EmployeeEntity>(query, data);

    return result;
  }


  public async getEmployeePaging(dto: PagingDto): Promise<{ total: number, data: any }> {
    try {

      const query: any = { isDeleted: false };

      const $lookupRole = {
        $lookup: {
          from: COLLECTIONS.ROLE,
          foreignField: '_id',
          localField: 'roleId',
          as: 'role',
        },
      };

      const $unwindRole = {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      };

      const $projection = {
        $project: {
          _id: 1,
          fullName: 1,
          phoneNumber: 1,
          biography: 1,
          isBlock: 1,
          role: {
            _id: 1,
            name: 1,
          },
        },
      };

      const $pipline = [$lookupRole, $unwindRole, $projection];

      return await this.findPaging(query, dto, $pipline,);
    } catch (error) {
      console.log("error paging admin: ", error);
      throw new Error(error)
    }
  }


  public async getEmployee<t>(id: string): Promise<t> {

    try {

      const $match: any = {
        $match: {
          _id: new Types.ObjectId(id),
          isDeleted: false
        },
      };

      const $lookupRole = {
        $lookup: {
          from: COLLECTIONS.ROLE,
          foreignField: '_id',
          localField: 'roleId',
          as: 'role',
        },
      };

      const $unwindRole = {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      };

      const $projection = {
        $project: {
          _id: 1,
          fullName: 1,
          phoneNumber: 1,
          biography: 1,
          isBlock: 1,
          role: {
            _id: 1,
            name: 1,
          },
        },
      };

      const $pipline = [$match, $lookupRole, $unwindRole, $projection];

      const data = await this.aggregate($pipline);
      if (!data || !data[0]) throw EmployeeException.NotFound(id)
      return data[0];
    } catch (error) {
      throw EmployeeException.UnknownError(error);
    }
  }


  public async markDeleteEmployee<t>(id: string): Promise<string> {

    await this.markAsDeleted(id);

    return id;

  }

}
