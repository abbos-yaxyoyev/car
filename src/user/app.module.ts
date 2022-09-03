import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from '../common/config/config';
import { ResponseInterceptor } from '../common/framework/interceptor/response';
import { CarModule } from './module/car/car.module';
import { CategoryModule } from './module/category/category.module';


@Module({
  imports: [

    MongooseModule.forRoot(ENV.DB_URL),

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