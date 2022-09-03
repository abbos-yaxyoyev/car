import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileEntity } from '../../../../core/entities';
import { FileException } from '../../../../core/entities/file/exception';
import { DatabaseService } from '../../base.repository';
import { File, FileDocument } from '../../model/File/File.model';
import { IFileRepository } from './interface';

export class FileRepository extends DatabaseService<FileDocument> implements IFileRepository<FileEntity> {

  constructor(@InjectModel(File.name) private readonly model: Model<FileDocument>) {
    super(model);
  }


  public async createFile(data: FileEntity): Promise<FileEntity> {

    const result = await this.create<FileEntity>(data);

    return result;

  }


  public async updateFile(id: string, data: FileEntity): Promise<FileEntity> {

    const query = {
      isDeletd: false,
      _id: id
    }

    const result = await this.updateByQuery<FileEntity>(query, data);

    return result;
  }


  public async getFile<t>(id: string): Promise<t> {

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

      if (!data || !data[0]) throw FileException.NotFound(id)

      return data[0];

    } catch (error) {
      throw FileException.UnknownError(error);
    }
  }


  public async deleteFile<t>(id: string): Promise<string> {

    await this.deleteOne(id);

    return id;

  }


}
