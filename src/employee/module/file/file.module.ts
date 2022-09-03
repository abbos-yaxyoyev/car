import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from "../../../common/authentication/jwtStrategy/accessToken.strategy";
import { File, FileSchema } from "../../../common/framework/mongodb/model/File/File.model";
import { FileRepository } from "../../../common/framework/mongodb/repoisitory/File/File.repository";
import { IFileRepository } from "../../../common/framework/mongodb/repoisitory/File/interface";
import { FileUseCases } from "../../../common/use-case/File/File.use-case";
import { FileController } from "../../controller/file/file.controller";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    JwtModule.register({})
  ],
  controllers: [FileController],
  providers: [
    FileUseCases,
    AccessTokenStrategy,
    {
      provide: IFileRepository,
      useClass: FileRepository
    }
  ],
})
export class FileModule { }