import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import expressWinston from 'express-winston';
import constants from './constans.js';
import winstonInstance from './winston.js';
import passport from 'passport';
import session from 'express-session';
import fs from 'fs';

const publicKey = fs.readFileSync('./public_key.pem', 'utf8');

const allowedDomains = [constants.ALLOWED_DOMAIN];

export default app => {
  app.use(compression());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      exposedHeaders: ['Authorization'],
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedDomains.indexOf(origin) === -1) {
          const msg = `This site ${origin} does not have access. Only specific domains are allowed to access it`;
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

  app.use(
    session({
      secret: publicKey,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(methodOverride());
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
  // Configure Morgan to log to the console and the log file using custom logger
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => {
          // Log the message to the custom Winston logger
          winstonInstance.info(message.trim());
        },
      },
    })
  );

  if (constants.isDev) {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');
    app.use(
      expressWinston.logger({
        winstonInstance,
        meta: true,
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true,
      })
    );
  }
};
