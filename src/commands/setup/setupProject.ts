import { SimpleGit, simpleGit } from 'simple-git';
import path from 'path';
import inquirer from 'inquirer';
import { log } from '../../utils/logger';
import { authenticateGitHub, createGitHubRepo } from '../github';
import { authenticateContentful } from '../contentful';
import { installDependencies } from './setupDependencies';
import fs from 'fs-extra';
import { startWatchingModels } from '../nextjs/watchModels';
import { exec } from 'child_process';

const git: SimpleGit = simpleGit();

export const setupProject = async (): Promise<void> => {
  const repoUrl = 'https://github.com/withutraining/wu_web_template';
  const targetDir = './frontend';

  try {
    const octokit = await authenticateGitHub();

    if (fs.existsSync(targetDir)) {
      const { overwriteDir } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwriteDir',
          message: `${targetDir} already exists. Do you want to overwrite it?`,
          default: false,
        },
      ]);

      if (!overwriteDir) {
        log('Setup cancelled.', 'info');
        return;
      }

      await fs.remove(targetDir);
    }

    log(`Cloning repository from ${repoUrl} into ${targetDir}...`, 'info');
    await git.clone(repoUrl, targetDir);
    log('Repository cloned successfully.', 'info');

    const projectPath = path.resolve(targetDir);

    await installDependencies(projectPath);

    const { contentfulClient, managementToken, spaces } =
      await authenticateContentful();

    const spaceChoices = spaces.map((space) => ({
      name: space.name,
      value: space.sys.id,
    }));
    const { spaceId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'spaceId',
        message: 'Select a Contentful space:',
        choices: spaceChoices,
      },
    ]);

    const environments = await contentfulClient
      .getSpace(spaceId)
      .then((space) => space.getEnvironments().then((res) => res.items));
    const environmentChoices = environments.map((env) => ({
      name: env.name,
      value: env.sys.id,
    }));
    const { environmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'environmentId',
        message: 'Select an environment:',
        choices: environmentChoices,
      },
    ]);

    const envVars = await inquirer.prompt([
      {
        type: 'input',
        name: 'NEXT_PUBLIC_API_URL',
        message: 'Enter the API URL:',
        default: 'http://localhost:3000',
      },
    ]);

    const envFilePath = path.join(projectPath, '.env');
    if (fs.existsSync(envFilePath)) {
      const { overwriteEnv } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwriteEnv',
          message: '.env file already exists. Do you want to overwrite it?',
          default: false,
        },
      ]);

      if (!overwriteEnv) {
        log('Setup cancelled.', 'info');
        return;
      }
    }

    const envFileContent = [
      `NEXT_PUBLIC_CONTENTFUL_SPACE_ID=${spaceId}`,
      `NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID=${environmentId}`,
      `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=${managementToken}`,
      ...Object.keys(envVars).map((key) => `${key}=${envVars[key]}`),
    ].join('\n');
    await fs.writeFile(envFilePath, envFileContent);
    log('.env file created successfully.', 'info');

    const newRepo = await createGitHubRepo(octokit);
    if (!newRepo) {
      log('Error creating GitHub repository.', 'error');
      return;
    }
    log(`New GitHub repository created: ${newRepo.html_url}`, 'info');

    await git.init();
    await git.addRemote('origin', newRepo.clone_url);
    await git.add('.');
    await git.commit('Initial commit');
    await git.push('origin', 'master');

    log('Initial commit pushed to GitHub.', 'info');

    const modelsDir = path.join(projectPath, 'models');
    const sdkDir = path.join(projectPath, 'sdk');
    const typesDir = path.join(projectPath, 'types');
    const uiDir = path.join(projectPath, 'ui');

    [modelsDir, sdkDir, typesDir, uiDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    });

    log('Starting to watch the models directory for changes...', 'info');
    startWatchingModels(modelsDir);

    log('Starting development server and Storybook...', 'info');
    exec(
      'bun dev && bun storybook',
      { cwd: projectPath },
      (error, stdout, stderr) => {
        if (error) {
          log(
            `Error starting development server or Storybook: ${stderr}`,
            'error',
          );
          return;
        }
        log(stdout, 'info');
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      log(`Error setting up project: ${error.message}`, 'error');
    } else {
      log('An unknown error occurred while setting up the project.', 'error');
    }
  }
};
