import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case process.env.DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case process.env.TEST:
          config = databaseConfig.test;
          break;
        case process.env.PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels(['models goes here']);
      await sequelize.sync();
      return sequelize;
    },
  },
];
