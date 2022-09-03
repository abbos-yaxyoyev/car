import { DynamicModule, Module } from '@nestjs/common';
import { createDatabaseConnection, createDatabaseProviders } from './database.provider';
import { DatabaseFeatureOptions } from './interface/database.interface';

@Module({})
export class DatabaseModule {

  // static forRoot(options: DatabaseModuleOptions): DynamicModule {

  //   const dbModule = DatabaseCoreModule.forRoot(DatabaseCoreModule, options);

  //   return dbModule;

  // }

  // static forRootAsync(
  //   options: AsyncModuleConfig<DatabaseModuleOptions>,
  // ): DynamicModule {

  //   const dbModule = DatabaseCoreModule.forRootAsync(
  //     DatabaseCoreModule,
  //     options,
  //   );

  //   return dbModule;
  // }

  static forFeature(options: DatabaseFeatureOptions): DynamicModule {

    try {

      const databaseProvider = createDatabaseProviders(options);

      return {
        module: DatabaseModule,
        imports: [
        ],
        providers: [...createDatabaseConnection(), ...databaseProvider],
        exports: [...databaseProvider],
      };


    } catch (e) {
      console.log("DatabaseModule error: ", e);
    }
  }
}