import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  // Database connection
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  dbName: 'inventory',
  schema: 'mikroorm_demo', // Separate schema to avoid conflicts

  // Entity discovery
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],

  // Advanced Mikro-ORM features
  metadataProvider: TsMorphMetadataProvider,
  
  // Enable advanced features
  debug: process.env.NODE_ENV !== 'production',
  
  // Connection pooling
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
  },

  // Migrations configuration
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './src/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: 'ts',
  },

  // Extensions
  extensions: [Migrator],

  // Performance optimizations
  // cache: {
  //   enabled: true,
  //   pretty: true,
  //   adapter: 'memory',
  // },

  // Logging
  logger: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MikroORM] ${message}`);
    }
  },

  // Type-safe configuration
  strict: true,
  validate: true,
  discovery: {
    warnWhenNoEntities: false,
    requireEntitiesArray: false,
    alwaysAnalyseProperties: false,
  },

  // Advanced query features
  forceEntityConstructor: true,
  forceUndefined: false,
  forceUtcTimezone: true,
  timezone: '+00:00',

  // Serialization
  serialization: {
    includePrimaryKeys: true,
  },
});