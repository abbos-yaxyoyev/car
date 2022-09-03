import * as mongoose from 'mongoose';

export const firstDatabaseProvider = {
  provide: '<Provider name>',
  useFactory: async (): Promise<mongoose.Connection> => {
    return await mongoose.createConnection('<MongoDB URI>')
  }
}