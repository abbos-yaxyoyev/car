import { BaseEntity } from "../base.entity";

export class EmployeeEntity extends BaseEntity {

  fullName: string;

  phoneNumber: string;

  password?: string;

  refreshToken?: string;

  imgUrl?: string;

  birthday?: Date;

  biography?: string;

  roleId: string;

  isBlock?: boolean;

}