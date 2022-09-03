import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from '../common/config/config';
import { ResponseInterceptor } from '../common/framework/interceptor/response';
import { Car } from '../common/framework/mongodb/model/car/car.model';
import { Category } from '../common/framework/mongodb/model/category/category.model';
import { CarModule } from './module/car/car.module';
import { CategoryModule } from './module/category/category.module';
import { EmployeeModule } from './module/employee/employee.module';
import { FileModule } from './module/file/file.module';
import { RoleModule } from './module/role/role.module';

console.log("Category.name: ", Category.name);
console.log("Car.name: ", Car.name);

console.log("CarModule: ", CarModule);
console.log("CategoryModule: ", CategoryModule);

@Module({
  imports: [

    MongooseModule.forRoot(ENV.DB_URL),

    EmployeeModule,

    RoleModule,

    FileModule,

    CarModule,

    CategoryModule,

  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }