import { v4 as uuid } from 'uuid';
import { createMockExecutionContext } from '@jupiterone/integration-sdk/testing';
import validateInvocation from '../validateInvocation';
import fetchMock from 'jest-fetch-mock';
import { USERS_READ_SCOPE } from '../provider';

beforeEach(() => {
  fetchMock.doMock();
});

test('rejects if unable to hit provider apis', async () => {
  fetchMock.mockResponse(() =>
    Promise.resolve({
      status: 403,
      body: 'Unauthorized',
    }),
  );

  const context = createMockExecutionContext();
  context.instance.config = {
    accessToken: uuid(),
    scopes: USERS_READ_SCOPE,
  };

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate with provided credentials/,
  );
});

test('should return undefined if configuration is valid', async () => {
  fetchMock.mockResponse(JSON.stringify({}));
  const context = createMockExecutionContext();
  await expect(validateInvocation(context)).resolves.toBe(undefined);
});
