import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { COLLECTIONS } from '../../../../constant/collection';
import { CarEntity } from '../../../../core/entities';
import { CarException } from '../../../../core/entities/car/exception';
import { PagingDto } from '../../../../core/validation/dtos/paging.dto';
import { DatabaseService } from '../../base.repository';
import { Car, CarDocument } from '../../model/car/Car.model';
import { ICarRepository } from './interface';

export class CarRepository extends DatabaseService<CarDocument> implements ICarRepository<CarEntity> {

  constructor(@InjectModel(Car.name) private readonly model: Model<CarDocument>) {
    super(model);
  }


  public async createCar(data: CarEntity): Promise<CarEntity> {

    const result = await this.create<CarEntity>(data);

    return result;

  }


  public async updateCar(id: string, data: CarEntity): Promise<CarEntity> {

    const query = {
      isDeletd: false,
      _id: id
    }

    const result = await this.updateByQuery<CarEntity>(query, data);

    return result;
  }


  public async getCarPaging(dto: PagingDto): Promise<{ total: number, data: any }> {
    try {

      const query: any = { isDeleted: false };

      const $lookupFile = {
        $lookup: {
          from: COLLECTIONS.FILE,
          foreignField: 'carId',
          localField: '_id',
          as: 'files',
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

      const $pipline = [$lookupFile, $projection];

      return await this.findPaging(query, dto, $pipline);

    } catch (error) {
      console.log("error paging Car: ", error);
      throw new Error(error)
    }
  }


  public async getCar<t>(id: string): Promise<t> {

    try {

      const $match: any = {
        $match: {
          _id: new Types.ObjectId(id),
          isDeleted: false
        },
      };


      const $lookupFile = {
        $lookup: {
          from: COLLECTIONS.FILE,
          foreignField: 'carId',
          localField: '_id',
          as: 'files',
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

      const $pipline = [$match, $lookupFile, $projection];

      const data = await this.aggregate($pipline);

      if (!data || !data[0]) throw CarException.NotFound(id)

      return data[0];

    } catch (error) {
      throw CarException.UnknownError(error);
    }
  }


  public async markDeleteCar(id: string): Promise<string> {

    await this.markAsDeleted(id);

    return id;

  }

  public async hasAccess(id: string, access: string): Promise<any> {
    console.log("CarId: ", id);
    const Car = await this.findById(id);
    if (!Car[access] || Car.isDeleted) throw CarException.NotEnoughPermission({ id, access });
  }


}
