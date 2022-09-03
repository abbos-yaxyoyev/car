import { FileEntity } from "../../../../core/entities";


export abstract class IFileRepository<T> {

  abstract createFile(item: T): Promise<FileEntity>

  abstract getFile(id: string): Promise<FileEntity>;

  abstract updateFile(id: string, item: T): Promise<FileEntity>;

  abstract deleteFile(id: string): Promise<string>;

}
