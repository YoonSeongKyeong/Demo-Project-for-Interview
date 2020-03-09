import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Request, Response } from 'express';
import express from 'express';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { AppRoutes } from './routes';
import { methodNameVerifier } from './utils/methodNameVerifier';
import { CreateServer } from './interface/serversideSpecific';
import { configs } from './utils/configs';

// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
export const createServer = async (): Promise<CreateServer | undefined> => {
  try {
    const connection = await createConnection();

    // create express app
    const app = express();

    // apply middlewares
    app.use(logger('common'));
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: [configs.CLIENT, 'http://localhost:3000'],
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
        credentials: true,
      }),
    );

    // register all application routes
    AppRoutes.forEach(route => {
      if (!methodNameVerifier(route.method)) {
        throw new Error(
          `method name is not valid : check this in route file: ROUTE_PATH: ${route.path}, ROUTE_METHOD: ${route.method}`,
        );
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore : route.method is valid routing method name of app
      app[route.method](route.path, (request: Request, response: Response, next: Function) => {
        route
          .action(request, response)
          .then(() => next)
          .catch((err: Error) => next(err));
      });
    });

    // run app
    const httpServer = app.listen(configs.SERVER_PORT); // httpServer is the key of closing server

    console.log(`Express application is up and running on port ${configs.SERVER_PORT}`);

    return { app, connection, httpServer };
  } catch (error) {
    console.log('TypeORM connection error: ', error);
  }
};
