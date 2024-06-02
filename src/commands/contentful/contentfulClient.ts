import open from 'open';
import inquirer from 'inquirer';
import { ClientAPI, createClient, Space } from 'contentful-management';
import { log } from '../../utils/logger';

interface AuthResult {
  contentfulClient: ClientAPI;
  managementToken: string;
  spaces: Space[];
}

const YOUR_CLIENT_ID = 'ZOmvDrjTrlXjOYOQQcke04OsmA_2H786DEYSrepPV9Y';
const LOCAL_REDIRECT_URI = 'http://localhost:3000/api/callback';
const PRODUCTION_REDIRECT_URI =
  'https://main.d3k5ew5fkjos6c.amplifyapp.com/en-US/api/callback';
const redirectUri =
  process.env.NODE_ENV === 'production'
    ? PRODUCTION_REDIRECT_URI
    : LOCAL_REDIRECT_URI;

const CONTENTFUL_OAUTH_URL = `https://be.contentful.com/oauth/authorize?response_type=token&client_id=${YOUR_CLIENT_ID}&redirect_uri=${redirectUri}&scope=content_management_manage`;

export const authenticateContentful = async (): Promise<AuthResult> => {
  let managementToken: string = '';
  let spaces: Space[] = [];

  log('Opening browser for Contentful OAuth...', 'info');
  await open(CONTENTFUL_OAUTH_URL);

  const { token } = await inquirer.prompt([
    {
      type: 'input',
      name: 'token',
      message:
        'Enter the Contentful Management API token from the OAuth callback URL:',
    },
  ]);

  managementToken = token;
  // Create a new client with the provided token
  const client: ClientAPI = createClient({ accessToken: managementToken });

  try {
    spaces = (await client.getSpaces()).items as Space[];
    log('Contentful API token validated successfully.', 'info');
  } catch (error) {
    log(`Invalid token. Please try again. ${error}`, 'error');
    process.exit(1);
  }
  return { contentfulClient: client, managementToken, spaces };
};
