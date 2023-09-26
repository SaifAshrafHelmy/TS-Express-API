// CLOSE db client connection after allllll tests in the projects are done

import { client } from './db';

global.afterAll(async () => {
  await client.close();
});
