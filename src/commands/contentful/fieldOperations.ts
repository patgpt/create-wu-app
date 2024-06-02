import {
  ClientAPI,
  ContentFields,
  ContentType,
  Environment,
  Space,
} from 'contentful-management';

import { getEnvironment, getSpace } from './utilities';

export class ContentfulFieldOperations {
  private client: ClientAPI;

  constructor(client: ClientAPI) {
    this.client = client;
  }

  async createField(
    contentTypeId: string,
    field: ContentFields<ContentFields>,
  ): Promise<void> {
    const space: Space = await getSpace(
      this.client,
      process.env.CONTENTFUL_SPACE_ID!,
    );
    const environment: Environment = await getEnvironment(
      space,
      process.env.CONTENTFUL_ENVIRONMENT_ID!,
    );
    const contentType: ContentType = await environment.getContentType(
      contentTypeId,
    );

    contentType.fields.push(field);
    await contentType.update();
    await contentType.publish();
  }

  async updateField(
    contentTypeId: string,
    fieldId: string,
    field: ContentFields<ContentFields>,
  ): Promise<void> {
    const space: Space = await getSpace(
      this.client,
      process.env.CONTENTFUL_SPACE_ID!,
    );
    const environment: Environment = await getEnvironment(
      space,
      process.env.CONTENTFUL_ENVIRONMENT_ID!,
    );
    const contentType: ContentType = await environment.getContentType(
      contentTypeId,
    );

    const existingFieldIndex = contentType.fields.findIndex(
      (f: ContentFields) => f.id === fieldId,
    );
    if (existingFieldIndex >= 0) {
      contentType.fields[existingFieldIndex] = field;
      await contentType.update();
      await contentType.publish();
    } else {
      throw new Error(`Field with id ${fieldId} not found.`);
    }
  }

  async deleteField(contentTypeId: string, fieldId: string): Promise<void> {
    const space: Space = await getSpace(
      this.client,
      process.env.CONTENTFUL_SPACE_ID!,
    );
    const environment: Environment = await getEnvironment(
      space,
      process.env.CONTENTFUL_ENVIRONMENT_ID!,
    );
    const contentType: ContentType = await environment.getContentType(
      contentTypeId,
    );

    const existingFieldIndex = contentType.fields.findIndex(
      (f: ContentFields) => f.id === fieldId,
    );
    if (existingFieldIndex >= 0) {
      contentType.fields.splice(existingFieldIndex, 1);
      await contentType.update();
      await contentType.publish();
    } else {
      throw new Error(`Field with id ${fieldId} not found.`);
    }
  }
}
