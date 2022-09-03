import { CategoryEntity } from "../../../../core/entities";
import { PagingDto } from "../../../../core/validation/dtos/paging.dto";


export abstract class ICategoryRepository<T> {

  abstract createCategory(item: T): Promise<CategoryEntity>

  abstract getCategoryPaging(item: PagingDto): Promise<{ total: number, data: any }>;

  abstract getCategory(id: string): Promise<CategoryEntity>;

  abstract updateCategory(id: string, item: T): Promise<CategoryEntity>;

  abstract markDeleteCategory(id: string): Promise<string>;

}
