import { createServer } from './app';
import { setConfigure } from './utils/configs';
import { prepareSetUpData } from './utils/prepareSetUpData';

const main = async (): Promise<void> => {
  setConfigure();
  const serverObj = await createServer();
  if (!serverObj) {
    throw new Error('Failed Server Initialization');
  }
  if (process.env.NODE_ENV === 'develop') {
    await prepareSetUpData({ connection: serverObj.connection }); // setup Data for dev testing
  }
};

main();
