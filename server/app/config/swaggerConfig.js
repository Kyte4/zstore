import swaggerJSDoc from 'swagger-jsdoc';
// Swagger конфиг
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZStore API',
      version: '1.0.0',
      description: 'Документация API для ZStore',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
  },
  apis: ['./server/app/routes/*.js'], // или путь к вашим роутам
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;