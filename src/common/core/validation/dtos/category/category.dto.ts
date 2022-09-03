import { IsMongoId, IsOptional, IsString } from "class-validator";
import { BaseDto, BaseDtoGroup } from "../base.dto";

export class CategoryDtoGroup extends BaseDtoGroup {

}

export class CategoryDto extends BaseDto {

  @IsOptional({
    groups: [CategoryDtoGroup.UPDATE]
  })
  @IsString({
    groups: [CategoryDtoGroup.CREATE, CategoryDtoGroup.UPDATE]
  })
  name: string;


  @IsOptional({
    groups: [CategoryDtoGroup.UPDATE]
  })
  @IsString({
    groups: [CategoryDtoGroup.CREATE, CategoryDtoGroup.UPDATE]
  })
  imgUrl: string;


  @IsOptional({
    groups: [CategoryDtoGroup.CREATE, CategoryDtoGroup.UPDATE]
  })
  @IsMongoId(
    {
      groups: [CategoryDtoGroup.CREATE, CategoryDtoGroup.UPDATE],
    }
  )
  parentId: string;

}