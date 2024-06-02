import { getEnvironment } from '../contentful/contentfulClient';
import { log } from '../../utils/logger';
import { ContentType } from 'contentful-management';

const handleError = (error: unknown): void => {
  if (error instanceof Error) {
    log(`Error: ${error.message}`, 'error');
  } else {
    log('An unknown error occurred.', 'error');
  }
};

export const createContentType = async (
  contentType: ContentType,
): Promise<void> => {
  try {
    const environment = await getEnvironment();
    const createdContentType = await environment.createContentType(contentType);
    await createdContentType.publish();
    log(`Content type created: ${createdContentType.name}`, 'info');
  } catch (error) {
    handleError(error);
  }
};

export const readContentType = async (
  contentTypeId: string,
): Promise<ContentType | null> => {
  try {
    const environment = await getEnvironment();
    return await environment.getContentType(contentTypeId);
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const updateContentType = async (
  contentType: ContentType,
): Promise<void> => {
  try {
    const environment = await getEnvironment();
    const contentTypeToUpdate = await environment.getContentType(
      contentType.sys.id,
    );
    Object.assign(contentTypeToUpdate, contentType);
    const updatedContentType = await contentTypeToUpdate.update();
    await updatedContentType.publish();
    log(`Content type updated: ${updatedContentType.name}`, 'info');
  } catch (error) {
    handleError(error);
  }
};

export const deleteContentType = async (
  contentTypeId: string,
): Promise<void> => {
  try {
    const environment = await getEnvironment();
    const contentTypeToDelete = await environment.getContentType(contentTypeId);
    await contentTypeToDelete.unpublish();
    await contentTypeToDelete.delete();
    log(`Content type deleted: ${contentTypeId}`, 'info');
  } catch (error) {
    handleError(error);
  }
};
