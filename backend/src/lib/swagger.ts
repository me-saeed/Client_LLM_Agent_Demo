import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from '../docs/openapi';

export const setupSwagger = (app: Express) => {
  app.get('/api-docs.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
};
