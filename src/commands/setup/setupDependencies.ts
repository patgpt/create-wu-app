import { exec } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { colors } from '../cli-ui';
import { log } from '../../utils/logger';

export const checkPermissions = (dir: string): Promise<boolean> => {
  return new Promise((resolve) => {
    exec(`test -w ${dir}`, (error) => {
      resolve(!error);
    });
  });
};

export const setOwnershipAndPermissions = (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'password',
          name: 'password',
          message: 'Enter your password for setting ownership and permissions:',
          mask: '*',
        },
      ])
      .then(({ password }) => {
        const command = `echo "${password}" | sudo -S chown -R $(whoami) ${dir} && chmod -R 755 ${dir}`;
        exec(command, (error, stdout, stderr) => {
          if (error) {
            log(
              chalk.hex(colors.error)(
                `Error setting ownership and permissions: ${stderr}`,
              ),
              'error',
            );
            reject(error);
          } else {
            log(
              chalk.hex(colors.primaryDark)(
                `Ownership and permissions set successfully for ${dir}`,
              ),
              'info',
            );
            resolve();
          }
        });
      });
  });
};

export const installDependencies = (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const spinner = ora('Installing dependencies with bun...').start();
    exec(
      'bun install && bun pm trust --all',
      { cwd: dir },
      (error, stdout, stderr) => {
        if (error) {
          spinner.fail('Error installing dependencies');
          log(chalk.hex(colors.error)(`Error: ${stderr}`), 'error');
          reject(error);
        } else {
          spinner.succeed('Dependencies installed successfully');
          log(chalk.hex(colors.primaryDark)(stdout), 'info');
          resolve();
        }
      },
    );
  });
};
