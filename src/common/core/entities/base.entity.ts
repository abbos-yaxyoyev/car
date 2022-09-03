
export class BaseEntity {

  _id?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  createdBy?: string;

  updatedBy?: string;

  deleted_by?: string;

  isDeleted?: boolean;
}