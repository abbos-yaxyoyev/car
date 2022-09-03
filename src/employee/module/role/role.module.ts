import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from "../../../common/authentication/jwtStrategy/accessToken.strategy";
import { Role, RoleSchema } from "../../../common/framework/mongodb/model/role/role.model";
import { RoleRepository } from "../../../common/framework/mongodb/repoisitory/role/role.repository";
import { RoleUseCases } from "../../../common/use-case/role/role.use-case";
import { RoleController } from "../../controller/role/role.controller";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    JwtModule.register({})
  ],
  controllers: [RoleController],
  providers: [
    RoleUseCases,
    AccessTokenStrategy,
    {
      provide: 'role',
      useClass: RoleRepository
    }
  ],
})
export class RoleModule { }