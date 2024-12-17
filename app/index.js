import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import nconf from 'nconf';
import { Umzug, SequelizeStorage } from 'umzug';

import Controllers from './controllers/index.js';
import {
  Auditor,
  Authentication,
  ErrorHandlerMiddleware,
  Validator,
} from './middleware/index.js';
import Models from './models/index.js';
import routes from './routes/index.js';

export default class App {
  constructor({ logger }) {
    this.app = express();
    this.app.set('logger', logger);
    this.app.set('models', new Models(nconf.get('DATABASE_URL')));
    this.app.set('controllers', new Controllers(this.app.get('models')));
    this.app.set('Auditor', new Auditor(this.app.get('models')));
    const auth = Authentication(logger);
    this.app.set('Authentication', auth);
    this.app.set('Validator', new Validator());

    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(bodyParser.json({
      type: 'application/vnd.api+json',
    }));
    this.app.use(cookieParser());

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Version');
      res.header('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      if (req.method === 'GET') {
        res.setHeader('Last-Modified', (new Date()).toUTCString());
      }
      return next();
    });

    this.app.use(auth.checkBearerAuth);

    routes(this.app);

    this.app.use(ErrorHandlerMiddleware);

    this.app.use((err, req, res, next) => {
      if (err) {
        logger.error('500 ERROR: Unhandled error', err);
        return res.status(500).json({
          errors: [{
            detail: 'Something went wrong. Please try again later.',
          }],
        });
      }
      return next();
    });

    this.app.use((req, res) => {
      return res.sendStatus(501);
    });
  }

  async startServer() {
    const app = this.app;
    const logger = app.get('logger');
    const models = app.get('models');

    const umzug = new Umzug({
      migrations: {
        glob: 'migrations/*.js',
        resolve: (params) => {
          const getModule = () => import(params.path);
          return {
            name: params.name,
            up: async (params) => (await getModule()).up(params),
            down: async(params) => (await getModule()).down(params),
          };
        },
      },
      context: models.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: models.sequelize }),
      logger: console,
    });
    await umzug.up();

    const port = process.env.PORT || nconf.get('NODE_PORT');
    return app.listen(port, () => {
      logger.info(`[API] Listening on port ${port}`);
    });
  }
}
