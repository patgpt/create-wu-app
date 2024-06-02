import { ClientAPI, Space, Environment } from 'contentful-management';

export const getSpace = async (
  client: ClientAPI,
  spaceId: string,
): Promise<Space> => {
  return await client.getSpace(spaceId);
};

export const getEnvironment = async (
  space: Space,
  environmentId: string,
): Promise<Environment> => {
  return await space.getEnvironment(environmentId);
};

export const listSpaces = async (client: ClientAPI): Promise<Space[]> => {
  const spaces = await client.getSpaces();
  return spaces.items as Space[];
};

export const listEnvironments = async (
  space: Space,
): Promise<Environment[]> => {
  const environments = await space.getEnvironments();
  return environments.items as Environment[];
};
