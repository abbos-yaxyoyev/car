import { BaseEntity } from "../base.entity";

export class CategoryEntity extends BaseEntity {

  name: string;

  imgUrl: string;

  parentId?: string;

}