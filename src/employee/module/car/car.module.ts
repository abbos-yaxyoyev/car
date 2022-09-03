import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from "../../../common/authentication/jwtStrategy/accessToken.strategy";
import { Car, CarSchema } from "../../../common/framework/mongodb/model/car/car.model";
import { CarRepository } from "../../../common/framework/mongodb/repoisitory/car/car.repository";
import { CarUseCases } from "../../../common/use-case/car/car.use-case";
import { CarController } from "../../controller/car/car.controller";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    JwtModule.register({})
  ],
  controllers: [CarController],
  providers: [
    AccessTokenStrategy,
    CarUseCases,
    {
      provide: 'ICarRepository',
      useClass: CarRepository
    }
  ],
})
export class CarModule { }