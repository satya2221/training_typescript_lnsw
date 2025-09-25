const { PostgreSqlDriver, defineConfig } = require('@mikro-orm/postgresql');

module.exports = defineConfig({
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  dbName: 'inventory',
  schema: 'legacy_ecommerce',
  entities: ['./generated-entities/*.ts'],
  debug: true,
});
