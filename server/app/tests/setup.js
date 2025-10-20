import sequelize from '../config/dbConfig.js';
import { jwt, JWT_SECRET, JWT_EXPIRES_IN } from '../config/JWT.js';
afterAll(async () => {
  await sequelize.close();
});
beforeAll(() => {
  token = jwt.sign({ id: 1, username: 'testuser' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
});
