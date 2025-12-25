import sequelize from '../config/config.js';

afterAll(async () => {
  await sequelize.close();
});
