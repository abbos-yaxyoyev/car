import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoryEntity } from '../../../../core/entities';
import { PagingDto } from '../../../../core/validation/dtos/paging.dto';
import { DatabaseService } from '../../base.repository';
import { Category, CategoryDocument } from '../../model/category/category.model';
import { CategoryException } from './../../../../core/entities/category/exception';
import { ICategoryRepository } from './interface';

export class CategoryRepository extends DatabaseService<CategoryDocument> implements ICategoryRepository<CategoryEntity> {

  constructor(@InjectModel(Category.name) private model: Model<CategoryDocument>) {
    super(model);
  }


  public async createCategory(data: CategoryEntity): Promise<CategoryEntity> {

    const result = await this.create<CategoryEntity>(data);

    return result;

  }


  public async updateCategory(id: string, data: CategoryEntity): Promise<CategoryEntity> {

    const query = {
      isDeletd: false,
      _id: id
    }

    const result = await this.updateByQuery<CategoryEntity>(query, data);

    return result;
  }


  public async getCategoryPaging(dto: PagingDto): Promise<{ total: number, data: any }> {
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
      console.log("error pagingCategory: ", error);
      throw new Error(error)
    }
  }


  public async getCategory(id: string): Promise<CategoryEntity> {

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

      if (!data || !data[0]) throw CategoryException.NotFound(id)

      return data[0];

    } catch (error) {
      throw CategoryException.UnknownError(error);
    }
  }


  public async markDeleteCategory(id: string): Promise<string> {

    await this.markAsDeleted(id);

    return id;

  }

}
