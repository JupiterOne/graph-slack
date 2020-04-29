let mockSlackTestFn = jest.fn();
jest.mock('../provider/SlackProvider', () => {
  return {
    SlackWebClient: jest.fn().mockImplementation(() => {
      return {
        api: {
          test: mockSlackTestFn,
        },
        on: jest.fn(),
      };
    }),
  };
});

import { v4 as uuid } from 'uuid';
import { createMockExecutionContext } from '@jupiterone/integration-sdk/testing';
import validateInvocation from '../validateInvocation';
import { USERS_READ_SCOPE } from '../provider';
import { WebAPICallResult } from '@slack/web-api';

beforeEach(() => {
  mockSlackTestFn = jest.fn();
});

test('rejects if unable to hit provider apis', async () => {
  mockSlackTestFn.mockRejectedValueOnce(new Error('test'));

  const context = createMockExecutionContext({
    instanceConfig: {
      accessToken: uuid(),
      scopes: USERS_READ_SCOPE,
    },
  });

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate with provided credentials/,
  );
});

test('should return undefined if configuration is valid', async () => {
  const mockResponse: WebAPICallResult = {
    ok: true,
  };

  mockSlackTestFn.mockResolvedValueOnce(Promise.resolve(mockResponse));

  const context = createMockExecutionContext({
    instanceConfig: {
      accessToken: uuid(),
      scopes: USERS_READ_SCOPE,
      teamId: uuid(),
    },
  });

  await expect(validateInvocation(context)).resolves.toBe(undefined);
});
