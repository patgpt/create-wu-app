jest.mock('./contentfulClient');
jest.mock('./logger', () => ({
  log: jest.fn(),
}));

const mockGetEnvironment = getEnvironment as jest.MockedFunction<typeof getEnvironment>;
const mockEnvironment = {
  getContentType: jest.fn(),
};

beforeEach(() => {
  mockGetEnvironment.mockResolvedValue(mockEnvironment as any);
  jest.clearAllMocks();
});

describe('fieldOperations', () => {
  const field = {
    id: 'test-field',
    name: 'Test Field',
    type: 'Text',
  };

  const contentType = {
    sys: { id: 'test-id' },
    name: 'Test Content Type',
    fields: [] as any[],
    update: jest.fn().mockResolvedValue({
      publish: jest.fn().mockResolvedValue(contentType),
    }),
  };

  test('createField', async () => {
    mockEnvironment.getContentType.mockResolvedValue(contentType);

    await createField('test-id', field);

    expect(mockEnvironment.getContentType).toHaveBeenCalledWith('test-id');
    expect(contentType.fields).toContain(field);
    expect(contentType.update).toHaveBeenCalled();
    expect(contentType.update().publish).toHaveBeenCalled();
  });

  test('updateField', async () => {
    contentType.fields.push(field);
    mockEnvironment.getContentType.mockResolvedValue(contentType);

    await updateField('test-id', field);

    expect(mockEnvironment.getContentType).toHaveBeenCalledWith('test-id');
    expect(contentType.fields).toContain(field);
    expect(contentType.update).toHaveBeenCalled();
    expect(contentType.update().publish).toHaveBeenCalled();
  });

  test('deleteField', async () => {
    contentType.fields.push(field);
    mockEnvironment.getContentType.mockResolvedValue(contentType);

    await deleteField('test-id', 'test-field');

    expect(mockEnvironment.getContentType).toHaveBeenCalledWith('test-id');
    expect(contentType.fields).not.toContain(field);
    expect(contentType.update).toHaveBeenCalled();
    expect(contentType.update().publish).toHaveBeenCalled();
  });
});
