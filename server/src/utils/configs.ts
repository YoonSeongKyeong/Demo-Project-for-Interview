/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Configs } from '../interface/serversideSpecific';

// 명시적으로 환경변수들을 모아둔 오브젝트입니다.
export const configs: Configs = {
  LOAD_CONFIG: '', // 정상적으로 .env 파일이 로드되었는지 확인

  CLIENT_DOMAIN: '', // 클라이언트 도메인

  SERVER_PORT: '', // 서버 port

  JWT_SECRET: '', // JWT secret

  SALT_ROUND: '', // number of Rounds for generating salt

  TYPEORM_CONNECTION: '', // TYPE ORM ENV_VARIABLES
  TYPEORM_HOST: '',
  TYPEORM_USERNAME: '',
  TYPEORM_PASSWORD: '',
  TYPEORM_DATABASE: '',
  TYPEORM_PORT: '',
  TYPEORM_SYNCHRONIZE: '',
  TYPEORM_LOGGING: '',
  TYPEORM_ENTITIES: '',
  TYPEORM_MIGRATIONS: '',
  TYPEORM_SUBSCRIBERS: '',
  TYPEORM_ENTITIES_DIR: '',
  TYPEORM_MIGRATIONS_DIR: '',
  TYPEORM_SUBSCRIBERS_DIR: '',
  TYPEORM_MIGRATIONS_RUN: '',
};

// 환경변수를 초기화하는 함수입니다.
export const setConfigure = (): void => {
  if (process.env.NODE_ENV === 'production') {
    console.log();
    dotenv.config({ path: path.join(__dirname, '../../config/env/.env.production') });
  } else if (process.env.NODE_ENV === 'develop') {
    dotenv.config({ path: path.join(__dirname, '../../config/env/.env.develop') });
  } else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: path.join(__dirname, '../../config/env/.env.test') });
  } else {
    throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
  }

  if (process.env.LOAD_CONFIG === undefined) {
    // LOAD_CONFIG의 존재로 env 적용 확인
    throw new Error('.env 파일을 불러올 수 없습니다. config 폴더를 포함시켜주세요');
  }

  // configs 초기화
  Object.keys(configs).forEach((name: string) => {
    configs[name] = process.env[name] as string;
  });
};
