import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from "../../../common/authentication/jwtStrategy/accessToken.strategy";
import { Category, CategorySchema } from "../../../common/framework/mongodb/model/Category/Category.model";
import { CategoryRepository } from "../../../common/framework/mongodb/repoisitory/Category/Category.repository";
import { CategoryUseCases } from "../../../common/use-case/Category/Category.use-case";
import { CategoryController } from "../../controller/category/category.controller";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    JwtModule.register({})
  ],
  controllers: [CategoryController],
  providers: [
    CategoryUseCases,
    AccessTokenStrategy,
    {
      provide: "ICategoryRepository",
      useClass: CategoryRepository
    }
  ],
})
export class CategoryModule { }