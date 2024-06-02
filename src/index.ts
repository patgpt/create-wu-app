// src/index.ts

import 'dotenv/config';
import { setupProject } from './commands/setup/setupProject';

const run = async () => {
  await setupProject();
};

run();
