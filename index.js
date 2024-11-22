import './config/index.js';
import nconf from 'nconf';
import winston from 'winston';

import App from './app/index.js';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({
      stack: true,
    }),
    winston.format.splat(),
    winston.format.json(),
  ),
  level: 'info',
});

if (nconf.get('NODE_ENV') !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

const app = new App({ logger });
app.startServer();
