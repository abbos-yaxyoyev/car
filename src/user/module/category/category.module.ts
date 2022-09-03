import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from "../../../common/framework/mongodb/model/Category/Category.model";
import { CategoryRepository } from "../../../common/framework/mongodb/repoisitory/Category/Category.repository";
import { ICategoryRepository } from "../../../common/framework/mongodb/repoisitory/category/interface";
import { CategoryUseCases } from "../../../common/use-case/Category/Category.use-case";
import { CategoryController } from "../../controller/category/category.controller";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryUseCases,
    {
      provide: ICategoryRepository,
      useClass: CategoryRepository
    }
  ],
})
export class CategoryModule { }