import chalk from 'chalk';

export const log = (message: string, level: 'info' | 'error' | 'warn' = 'info'): void => {
  const timeStamp = new Date().toISOString();
  let logMessage = `[${timeStamp}] ${message}`;

  switch (level) {
    case 'info':
      logMessage = chalk.blue(logMessage);
      break;
    case 'error':
      logMessage = chalk.red(logMessage);
      break;
    case 'warn':
      logMessage = chalk.yellow(logMessage);
      break;
  }

  console.log(logMessage);
};

import fs from 'fs-extra';
import path from 'path';

export const writeEnvFile = async (
  projectPath: string,
  envVars: Record<string, string>
): Promise<void> => {
  const envFilePath = path.join(projectPath, '.env');
  const envFileContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  await fs.writeFile(envFilePath, envFileContent);
  log('.env file created successfully.', 'info');
};
