import sequelize from '../config/dbConfig.js';

afterAll(async () => {
  await sequelize.close();
});
