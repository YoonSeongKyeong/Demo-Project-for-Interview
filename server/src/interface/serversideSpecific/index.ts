/* eslint-disable @typescript-eslint/camelcase */
import { Connection } from 'typeorm';
import { Application } from 'express';
import * as http from 'http';

export interface Configs {
  LOAD_CONFIG: string; // 정상적으로 .env 파일이 로드되었는지 확인

  CLIENT_DOMAIN: string; // 클라이언트 도메인

  SERVER_PORT: string; // 서버 port

  JWT_SECRET: string; // JWT secret

  SALT_ROUND: string; // number of Rounds for generating salt

  TYPEORM_CONNECTION: string; // TYPE ORM ENV_VARIABLES
  TYPEORM_HOST: string;
  TYPEORM_USERNAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
  TYPEORM_PORT: string;
  TYPEORM_SYNCHRONIZE: string;
  TYPEORM_LOGGING: string;
  TYPEORM_ENTITIES: string;
  TYPEORM_MIGRATIONS: string;
  TYPEORM_SUBSCRIBERS: string;
  TYPEORM_ENTITIES_DIR: string;
  TYPEORM_MIGRATIONS_DIR: string;
  TYPEORM_SUBSCRIBERS_DIR: string;
  TYPEORM_MIGRATIONS_RUN: string;

  [key: string]: string; // Index Signature
}

export interface CreateServer {
  connection: Connection;
  app: Application;
  httpServer: http.Server;
}

export interface CreateUserEntity {}

export interface UpdateUserEntity {}

export interface TokenForJWT {}
