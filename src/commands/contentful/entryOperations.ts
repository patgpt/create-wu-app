import { Entry, ClientAPI, CreateEntryProps } from 'contentful-management';

export class ContentfulEntryOperations {
  private client: ClientAPI;

  constructor(client: ClientAPI) {
    this.client = client;
  }

  async createEntry(
    contentTypeId: string,
    fields: CreateEntryProps,
  ): Promise<Entry> {
    const space = await this.client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT_ID!,
    );
    const entry = await environment.createEntry(contentTypeId, fields);
    return entry;
  }

  async updateEntry(entryId: string, fields: CreateEntryProps): Promise<Entry> {
    const space = await this.client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT_ID!,
    );
    const entry = await environment.getEntry(entryId);
    Object.keys(fields.fields).forEach((key) => {
      entry.fields[key] = fields.fields[key];
    });
    const updatedEntry = await entry.update();
    return updatedEntry;
  }

  async deleteEntry(entryId: string): Promise<void> {
    const space = await this.client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT_ID!,
    );
    const entry = await environment.getEntry(entryId);
    await entry.delete();
  }
}
