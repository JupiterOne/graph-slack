let mockSlackTestFn = jest.fn();
jest.mock('../provider/SlackProvider', () => {
  return {
    SlackWebClient: jest.fn().mockImplementation(() => {
      return {
        api: {
          test: jest.fn(),
        },
        verifyAuthentication: mockSlackTestFn,
        on: jest.fn(),
      };
    }),
  };
});

import validateInvocation from '../validateInvocation';

const context = {
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
  instance: {
    config: {
      accessToken: 'test',
      teamId: 'team-id',
      scopes: 'read:test',
    },
  },
} as any;

beforeEach(() => {
  mockSlackTestFn = jest.fn();
});

test('rejects if unable to hit provider apis', async () => {
  mockSlackTestFn.mockRejectedValueOnce(
    new Error('Failed to authenticate with provided credentials'),
  );

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate with provided credentials/,
  );
});

test('should return undefined if configuration is valid', async () => {
  mockSlackTestFn.mockResolvedValueOnce(Promise.resolve());
  await expect(validateInvocation(context)).resolves.toBe(undefined);
});
