import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from "../../../common/authentication/jwtStrategy/accessToken.strategy";
import { RefreshTokenStrategy } from "../../../common/authentication/jwtStrategy/refreshToken.strategy";
import { Employee } from "../../../common/framework/mongodb/model/employee/employee.model";
import { EmployeeAuthRepository } from "../../../common/framework/mongodb/repoisitory/employee/employee.auth.repository";
import { EmployeeRepository } from "../../../common/framework/mongodb/repoisitory/employee/employee.repository";
import { IEmployeeAuthRepository, IEmployeeRepository } from "../../../common/framework/mongodb/repoisitory/employee/interface";
import { EmployeeUseCases } from "../../../common/use-case/employee/employee.use-case";
import { EmployeeController } from "../../controller/employee/employee.controller";
import { EmployeeSchema } from './../../../common/framework/mongodb/model/employee/employee.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
    JwtModule.register({})
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeUseCases,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: IEmployeeRepository,
      useClass: EmployeeRepository
    },
    {
      provide: IEmployeeAuthRepository,
      useClass: EmployeeAuthRepository
    }
  ],
})
export class EmployeeModule { }