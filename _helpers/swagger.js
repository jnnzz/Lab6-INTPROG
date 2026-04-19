import express from 'express';
const router = express.Router();
import swagger from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

router.use('/'. swagger.serve, swaggerUI.setup(swaggerDocument));

export default router;