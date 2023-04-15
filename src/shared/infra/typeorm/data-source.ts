/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { AppError } from '@/shared/errors/app-error.error';
import config from 'config';
import 'reflect-metadata';
import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { ORMLogger } from './logger/orm.logger';

export const dataSourceOptions: Map<string, DataSourceOptions> = new Map([
  [
    'default',
    {
      type: 'postgres',
      host: config.get('DATABASE.HOST'),
      port: config.get('DATABASE.PORT'),
      username: config.get('DATABASE.USERNAME'),
      password: config.get('DATABASE.PASSWORD'),
      database: config.get('DATABASE.NAME'),
      logger: new ORMLogger(),
      logging: process.env.NODE_ENV !== 'production',
      migrationsRun: true,
      entities: [
        `${__dirname}/modules/**/infra/typeorm/entities/*.entity.{js,ts}`,
      ],
      migrations: [`${__dirname}/shared/infra/typeorm/migrations/*.{js,ts}`],
      // subscribers: [`${__dirname}/subscribers/**/*.{js,ts}`],
    },
  ],
  ['companyContext', getCompanyDataSource(config.get('dbName'), true)],
]);

// to be used instead of getConnectionManager()
export class DataSourceManager {
  private static instance: DataSourceManager;

  private dataSources: Map<string, DataSource> = new Map();

  private constructor() {}

  public static getInstance(): DataSourceManager {
    if (!DataSourceManager.instance) {
      DataSourceManager.instance = new DataSourceManager();
    }
    return DataSourceManager.instance;
  }

  public async createDataSource(
    name: string,
    options?: DataSourceOptions,
  ): Promise<DataSource> {
    const _options = options || dataSourceOptions.get(name);

    if (!_options) {
      throw new AppError(
        `Failed to create data source: ${name} with options: ${_options}`,
      );
    }

    const dataSource = this.dataSources
      .set(name, await new DataSource(_options).initialize())
      .get(name);

    if (!dataSource) {
      throw new AppError(`Failed to create data source: ${name}`);
    }
    return dataSource;
  }

  public getDataSource(dataSourceName: string): DataSource {
    const dataSource = this.dataSources.get(dataSourceName || 'default');

    if (!dataSource) {
      throw new AppError(`Failed to get data source: ${dataSourceName}`);
    }
    return dataSource;
  }

  private map() {
    return Array.from(this.dataSources.values());
  }

  public getActiveDataSources() {
    return this.map().filter((ds: DataSource) => ds.isInitialized);
  }

  public debug() {
    console.log(
      'DataSourceManager.debug',
      this.getActiveDataSources().map((ds: DataSource) => {
        return {
          isInitialized: ds.isInitialized,
          type: ds.options.type,
          dbName: ds.options.database,
        };
      }),
    );
  }

  public async destroyDataSources() {
    return Promise.all(
      Array.from(this.dataSources.values()).map(dataStore =>
        dataStore.destroy(),
      ),
    )
      .then(data => {
        console.log(`Destroyed (${data.length}) data source`);
      })
      .catch(errors => {
        console.log('Error: Destroying DataSources:', errors);
      });
  }
}

export function getCompanyDataSource(
  databaseName: string,
  migrationsRun = true,
): DataSourceOptions {
  return {
    type: 'mysql',
    charset: 'utf8mb4_unicode_ci',
    host: config.get('dbHost'),
    port: Number(config.get('dbPort')),
    username: config.get('dbUser').toString(),
    password: config.get('dbPass').toString(),
    logger: new ORMLogger(),
    database: databaseName,
    acquireTimeout: 50000,
    connectTimeout: 50000,
    logging: process.env.NODE_ENV !== 'production',
    entities: [
      `${__dirname}/models/*.{js,ts}`,
      `${__dirname}/modules/**/models/*.{js,ts}`,
    ],
    migrations: [`${__dirname}/migrations/companyContext/*.{js,ts}`],
    subscribers: [`${__dirname}/subscribers/**/*.{js,ts}`],
    migrationsRun,
    bigNumberStrings: true,
  };
}

// HELPER FUNCTIONS FOR BETTER TYPEORM v0.2.x -> v0.3.x UPDATE
// to be used instead of getRepository()
export function getDataRepository<Entity extends ObjectLiteral>(
  entityClass: EntityTarget<Entity>,
  dataSourceName?: string,
): Repository<Entity> {
  return DataSourceManager.getInstance()
    .getDataSource(dataSourceName || 'default')
    .getRepository(entityClass);
}

// to be used instead of getConnection()
export function getDataSource(dataSourceName?: string): DataSource {
  return DataSourceManager.getInstance().getDataSource(
    dataSourceName || 'default',
  );
}
