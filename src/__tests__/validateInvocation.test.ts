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

import { createMockExecutionContext } from '../../test/context';
import validateInvocation from '../validateInvocation';
import { WebAPICallResult } from '@slack/web-api';

beforeEach(() => {
  mockSlackTestFn = jest.fn();
});

test('rejects if unable to hit provider apis', async () => {
  mockSlackTestFn.mockRejectedValueOnce(new Error('test'));
  const context = createMockExecutionContext();

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate with provided credentials/,
  );
});

test('should return undefined if configuration is valid', async () => {
  const mockResponse: WebAPICallResult = {
    ok: true,
  };

  mockSlackTestFn.mockResolvedValueOnce(Promise.resolve(mockResponse));
  const context = createMockExecutionContext();
  await expect(validateInvocation(context)).resolves.toBe(undefined);
});
