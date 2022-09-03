import { IsMongoId, IsNumber, IsOptional } from "class-validator";

export class BaseDtoGroup {
  static CREATE = 'create';
  static UPDATE = 'update';
  static DELETE = 'delete';
  static GET_BY_ID = 'getById';
  static NUMBER = 'number';
  static PAGENATION = 'pagination';
  static SET_STATE = 'state';
  static POSITION = 'position';
  static CREATE_WEB = 'web';
}

export class BaseDto {
  @IsOptional({
    groups: [BaseDtoGroup.PAGENATION,]
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      groups: [BaseDtoGroup.UPDATE, BaseDtoGroup.DELETE, BaseDtoGroup.GET_BY_ID, BaseDtoGroup.SET_STATE]
    }
  )
  _id: string;


  @IsOptional({
    groups: [BaseDtoGroup.CREATE,]
  })
  @IsMongoId({
    groups: [BaseDtoGroup.DELETE]
  })
  createdBy: string;


  @IsOptional({
    groups: [BaseDtoGroup.UPDATE]
  })
  @IsMongoId({
    groups: [BaseDtoGroup.UPDATE,]
  }
  )
  updatedBy: string;


  @IsOptional({
    groups: [BaseDtoGroup.DELETE,]
  })
  @IsMongoId({
    groups: [BaseDtoGroup.DELETE,]
  })
  deletedBy: string;
}