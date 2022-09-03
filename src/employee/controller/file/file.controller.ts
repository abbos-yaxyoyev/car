import {
  Body,
  Controller, Delete, Get,
  Param, Post, Put
} from '@nestjs/common';
import { FileEntity } from '../../../common/core/entities';
import { FileDto, FileDtoGroup } from '../../../common/core/validation/dtos';
import { MyValidationPipe } from '../../../common/core/validation/validate';
import { FileUseCases } from '../../../common/use-case/File/File.use-case';


@Controller('file')
export class FileController {

  constructor(private readonly FileService: FileUseCases) { }

  // @UseGuards(new ATGuard('name'))
  @Post()
  async createFile(@Body(new MyValidationPipe([FileDtoGroup.CREATE])) data: FileDto): Promise<FileEntity> {
    return await this.FileService.createFile(data);
  }

  // @UseGuards(new ATGuard('must_auth'))
  @Get(':id')
  async getFile(@Param(new MyValidationPipe([FileDtoGroup.GET_BY_ID])) data: { _id: string }): Promise<FileEntity> {
    return await this.FileService.getFileById(data._id);
  }

  // @UseGuards(new ATGuard('must_auth'))
  @Put()
  async updateFile(@Body(new MyValidationPipe([FileDtoGroup.UPDATE])) data: FileDto): Promise<FileEntity> {
    return await this.FileService.updateFile(data._id, data);
  }

  // @UseGuards(new ATGuard('must_auth'))
  @Delete(':id')
  async deleteFile(@Param(new MyValidationPipe([FileDtoGroup.DELETE])) data: { _id: string }): Promise<string> {
    return await this.FileService.deleteFile(data._id);
  }

}