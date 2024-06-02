import { getEnvironment } from '../src/commands/contentful/contentfulClient';
import {
  createContentType,
  deleteContentType,
  readContentType,
  updateContentType,
} from '../src/commands/nextjs/modelOperations';

jest.mock('../src/commands/contentful/contentfulClient');
jest.mock('../src/utils/logger', () => ({
  log: jest.fn(),
}));

const mockGetEnvironment = getEnvironment as jest.MockedFunction<
  typeof getEnvironment
>;
const mockEnvironment = {
  createContentType: jest.fn(),
  getContentType: jest.fn(),
};

beforeEach(() => {
  mockGetEnvironment.mockResolvedValue(mockEnvironment as any);
  jest.clearAllMocks();
});

describe('modelOperations', () => {
  const contentType = {
    sys: { id: 'test-id' },
    name: 'Test Content Type',
    fields: [],
  } as any;

  test('createContentType', async () => {
    mockEnvironment.createContentType.mockResolvedValue({
      publish: jest.fn().mockResolvedValue(contentType),
    });

    await createContentType(contentType);

    expect(mockEnvironment.createContentType).toHaveBeenCalledWith(contentType);
    expect(mockEnvironment.createContentType().publish).toHaveBeenCalled();
  });

  test('readContentType', async () => {
    mockEnvironment.getContentType.mockResolvedValue(contentType);

    const result = await readContentType('test-id');

    expect(mockEnvironment.getContentType).toHaveBeenCalledWith('test-id');
    expect(result).toEqual(contentType);
  });

  test('updateContentType', async () => {
    const mockUpdate = jest.fn().mockResolvedValue({
      publish: jest.fn().mockResolvedValue(contentType),
    });
    mockEnvironment.getContentType.mockResolvedValue({
      update: mockUpdate,
      ...contentType,
    });

    await updateContentType(contentType);

    expect(mockEnvironment.getContentType).toHaveBeenCalledWith(
      contentType.sys.id,
    );
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockUpdate().publish).toHaveBeenCalled();
  });

  test('deleteContentType', async () => {
    const mockUnpublish = jest.fn().mockResolvedValue(undefined);
    const mockDelete = jest.fn().mockResolvedValue(undefined);
    mockEnvironment.getContentType.mockResolvedValue({
      unpublish: mockUnpublish,
      delete: mockDelete,
    });

    await deleteContentType('test-id');

    expect(mockEnvironment.getContentType).toHaveBeenCalledWith('test-id');
    expect(mockUnpublish).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalled();
  });
});
