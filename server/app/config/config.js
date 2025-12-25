import dotenv from 'dotenv';

dotenv.config();

const { PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD } = process.env;

['PG_HOST', 'PG_PORT', 'PG_DB', 'PG_USER', 'PG_PASSWORD'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Env ${key} is required for sequelize-cli`);
  }
});

const base = {
  username: PG_USER,
  password: PG_PASSWORD,
  database: PG_DB,
  host: PG_HOST,
  port: Number(PG_PORT),
  dialect: 'postgres',
  logging: false,
};

export default {
  development: { ...base },
  test: { ...base },
  production: { ...base },
};

