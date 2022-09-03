import { Injectable } from '@nestjs/common';
import { Model, QueryOptions } from 'mongoose';
import { PagingDto } from '../../core/validation/dtos/paging.dto';

@Injectable()
export class DatabaseService<T> {

  constructor(protected mongodb: Model<T>) {

  }

  protected async count<T>(query) {
    try {
      return await this.mongodb.countDocuments(query);
    } catch (error) {
      throw error;
    }
  }

  protected async findAll<T>(query, options?: QueryOptions, projection: any = { __v: 0 }) {
    try {
      return await this.mongodb.find(query, projection, options);
    } catch (error) {
      throw error;
    }
  }

  protected async findOne<t>(query, options?: QueryOptions, projection: any = { __v: 0 }) {
    try {
      return await this.mongodb.findOne(query, projection, options);
    } catch (error) {
      throw error;
    }
  }

  protected async findById<t>(id: string, options?: QueryOptions, projection: any = { __v: 0 }) {
    try {
      console.log('this.mongodb: ', this.mongodb);
      return await this.mongodb.findOne({ _id: id, isDeleted: false }, projection, options);
    } catch (error) {
      throw error;
    }
  }

  protected async create<t>(data, options?): Promise<t> {
    try {
      const saved = await this.mongodb.create([data], options);
      return await this.mongodb.findById(saved[0]._id, {}, options);
    } catch (error) {
      throw error
    }
  }

  protected async insertMany<t>(data, options?) {
    try {
      return await this.mongodb.insertMany(data, options);
    } catch (error) {
      throw error;
    }
  }

  protected async deleteOne<t>(query, options?: QueryOptions) {
    try {
      return await this.mongodb.deleteOne(query, options);
    } catch (error) {
      throw error;
    }
  }

  protected async markAsDeleted<t>(id: string) {
    try {
      return await this.mongodb.findByIdAndUpdate(id, { isDeleted: true })
    } catch (error) {
      throw error;
    }
  }

  protected async updateById<t>(id, data, options?: QueryOptions) {
    try {
      await this.mongodb.findOneAndUpdate({ _id: id, isDeleted: false }, data, options);
      return await this.mongodb.findById(id);
    } catch (error) {
      throw error;
    }
  }

  protected async updateByQuery<t>(query, data, options?: QueryOptions): Promise<t> {
    try {
      return await this.mongodb.findOneAndUpdate(query, data, options);
    } catch (error) {
      throw error;
    }
  }

  protected async updateMany<t>(query, data, options?: QueryOptions) {
    try {
      return await this.mongodb.updateMany(query, data, options).exec();
    } catch (error) {
      throw error;
    }
  }

  protected async aggregate<t>(pipeline: Array<any>, options?) {
    try {
      return await this.mongodb.aggregate(pipeline, options).allowDiskUse(true).exec();
    } catch (error) {
      throw error;
    }
  }

  protected async findPaging<t>(
    query,
    dto: PagingDto,
    additional_pipeline: any = [
      {
        $project: {
          __v: 0,
        },
      },
    ],
    sort = null,
  ) {
    try {
      const { limit, page, sortBy, asc } = dto;

      const total = await this.mongodb.countDocuments(query);

      const $match = {
        $match: query,
      };

      const $sort = {
        $sort: {
          createdAt: -1,
        },
      };

      if (sortBy) {
        $sort.$sort = {} as any;
        $sort.$sort[`${sortBy}`] = asc > 0 ? 1 : -1;
      } else if (sort) {
        $sort.$sort = sort;
      }

      const $skip = {
        $skip: limit * (page - 1),
      };

      const $limit = {
        $limit: limit,
      };

      let pipeline: Array<any> = [$match, $sort, $skip, $limit];

      if (additional_pipeline.length > 0) {
        pipeline = [...pipeline, ...additional_pipeline];
      }

      const data = await this.mongodb.aggregate(pipeline).allowDiskUse(true).exec();

      return {
        total,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

}