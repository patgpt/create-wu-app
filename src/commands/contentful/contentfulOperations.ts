import { ClientAPI, Environment, Space } from 'contentful-management';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { colors } from '../cli-ui';
import { getSpace } from './utilities';

export const selectSpace = async (spaces: Space[]): Promise<string> => {
  const spaceChoices = spaces.map((space: Space) => ({
    name: space.name,
    value: space.sys.id,
  }));

  const { spaceId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'spaceId',
      message: chalk.hex(colors.primary)('Select a Contentful space:'),
      choices: spaceChoices,
    },
  ]);

  return spaceId;
};

export const selectEnvironment = async (
  client: ClientAPI,
  spaceId: string,
): Promise<string> => {
  const space = await getSpace(client, spaceId);
  const environments = await space.getEnvironments();
  const environmentChoices = environments.items.map((env: Environment) => ({
    name: env.name,
    value: env.sys.id,
  }));

  const { environmentId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'environmentId',
      message: chalk.hex(colors.primary)('Select an environment:'),
      choices: environmentChoices,
    },
  ]);

  return environmentId;
};
