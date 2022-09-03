import { PagingDto } from "../validation/dtos/paging.dto";


export abstract class IGenericRepository<T> {
  abstract findAll(item: PagingDto): Promise<T[]>;

  abstract findOne(id: number): Promise<T>;

  abstract insertOne(item: T): Promise<T>;

  abstract insertMany(item: T[]): Promise<T[]>;

  abstract updateOne(id: number, item: T): Promise<T>;

  abstract updateMany(item: T[]): Promise<T[]>;

  abstract deleteOne(id: number,): Promise<T>;

  abstract markDelete(id: number): Promise<T>;
}
