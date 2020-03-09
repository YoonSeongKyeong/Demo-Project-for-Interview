import { createServer } from './app';
import { setConfigure } from './utils/configs';
import { prepareSetUpData } from './utils/prepareSetUpData';

const main = async (): Promise<void> => {
  setConfigure();
  await createServer();
  if (process.env.NODE_ENV === 'develop') {
    await prepareSetUpData(); // setup Data for dev testing
  }
};

main();
