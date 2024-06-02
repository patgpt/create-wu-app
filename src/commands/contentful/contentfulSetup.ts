import inquirer from 'inquirer';
import chalk from 'chalk';
import { createClient, ClientAPI, Space } from 'contentful-management';
import { log } from '../../utils/logger';
import { colors } from '../cli-ui/theme';

export interface ContentfulAuthResult {
  contentfulClient: ClientAPI;
  managementToken: string;
  spaces: Space[];
}

export const authenticateContentful =
  async (): Promise<ContentfulAuthResult> => {
    let managementToken: string = '';
    let contentfulClient: ClientAPI;
    let spaces: Space[] = [];

    while (true) {
      ({ managementToken } = await inquirer.prompt([
        {
          type: 'password',
          name: 'managementToken',
          message: `${chalk.hex(colors.primary)(
            'Enter your Contentful Management API token:',
          )} ${chalk.hex(colors.secondary)(
            '(Create one here: https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/authentication)',
          )}`,
        },
      ]));

      contentfulClient = createClient({ accessToken: managementToken });

      try {
        const spaceResponse = await contentfulClient.getSpaces();
        spaces = spaceResponse.items;
        log(
          chalk.hex(colors.primaryDark)(
            'Contentful API token validated successfully.',
          ),
          'info',
        );
        break;
      } catch (error: any) {
        log(
          chalk.hex(colors.error)(
            `Invalid token: ${error.message}. Please try again.`,
          ),
          'error',
        );
      }
    }

    return { contentfulClient, managementToken, spaces };
  };

export const selectSpace = async (spaces: Space[]): Promise<string> => {
  const spaceChoices = spaces.map((space) => ({
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
  const environments = (await client.getSpace(spaceId))
    .getEnvironments()
    .then((envs) => envs.items);
  const environmentChoices = await environments.then((envs) =>
    envs.map((env) => ({
      name: env.name,
      value: env.sys.id,
    })),
  );
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
