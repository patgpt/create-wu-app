import { Octokit } from '@octokit/rest';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { colors } from '../cli-ui/theme';
import { log } from '../../utils/logger';

export const authenticateGitHub = async (): Promise<Octokit> => {
  let githubToken = '';

  while (true) {
    ({ githubToken } = await inquirer.prompt([
      {
        type: 'password',
        name: 'githubToken',
        message: `${chalk.hex(colors.primary)(
          'Enter your GitHub Personal Access Token:',
        )} ${chalk.hex(colors.secondary)(
          '(Create one here: https://github.com/settings/tokens)',
        )}`,
      },
    ]));

    const octokit = new Octokit({ auth: githubToken });

    try {
      await octokit.request('GET /user');
      log(
        chalk.hex(colors.primaryDark)('GitHub authentication successful.'),
        'info',
      );
      return octokit;
    } catch (error) {
      log(
        chalk.hex(colors.error)(
          'GitHub authentication failed. Please check your token and try again.',
        ),
        'error',
      );
    }
  }
};

export const createGitHubRepo = async (octokit: Octokit) => {
  const { repoName, orgName, isPrivate, isOrgRepo, createRepo } =
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createRepo',
        message: 'Do you want to create a new GitHub repository?',
        default: true,
      },
      {
        type: 'list',
        name: 'isOrgRepo',
        message:
          'Will this repository be created under a personal account or an organization?',
        choices: ['Personal', 'Organization'],
        when: (answers) => answers.createRepo,
      },
      {
        type: 'input',
        name: 'orgName',
        message: 'Enter the name of the GitHub organization:',
        when: (answers) => answers.isOrgRepo === 'Organization',
      },
      {
        type: 'input',
        name: 'repoName',
        message: 'Enter a name for the new GitHub repository:',
        when: (answers) => answers.createRepo,
      },
      {
        type: 'confirm',
        name: 'isPrivate',
        message: 'Should the repository be private?',
        default: true,
        when: (answers) => answers.createRepo,
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Create a new GitHub repository with the provided details?',
        when: (answers) => answers.createRepo,
      },
    ]);

  if (!createRepo) return null;

  if (isOrgRepo === 'Organization') {
    const { data: newRepo } = await octokit.repos.createInOrg({
      org: orgName,
      name: repoName,
      private: isPrivate,
    });
    return newRepo;
  } else {
    const { data: newRepo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: isPrivate,
    });
    return newRepo;
  }
};
