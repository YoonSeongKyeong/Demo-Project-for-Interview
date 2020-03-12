/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/camelcase */
import { Connection } from 'typeorm';
import { prepareTestData } from './prepareTestData';

export const prepareSetUpData = async ({
  connection,
}: {
  connection: Connection;
}): Promise<void> => {
  await connection.dropDatabase();
  await connection.runMigrations();
  await prepareTestData();
};
