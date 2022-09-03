import { Provider } from '@nestjs/common';

export function createDatabaseConnection(): Provider[] {
  return [

  ]
}


export function createDatabaseProviders(
  feature: any,
): Provider[] {

  const token = ''

  console.log("provide token: ", token);

  return [
    {
      inject: [],
      provide: 'base-repo',
      useFactory: (pool: Pool, client: Client) => {
        return new DatabaseService(pool, client, feature);
      },
    },
  ];
}