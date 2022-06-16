import {
  createMockStepExecutionContext,
  createMockIntegrationLogger,
} from '@jupiterone/integration-sdk-testing';
import { createSlackClient } from '../';
import { WebClientEvent } from '@slack/web-api';
import { SlackIntegrationConfig } from '../../type';
import {
  platformErrorFromResult,
  requestErrorWithOriginal,
} from '@slack/web-api/dist/errors';

// The timeout for the retry 5 times test
// has a minimum delay of 1 second and exponential
// back-off. The test needs extra time to run.
jest.setTimeout(15_0000);

test('should log error message when rate limited', () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>();

  const mockLogger = createMockIntegrationLogger();
  const infoFn = (mockLogger.info = jest.fn());
  context.logger = mockLogger;

  const slackClient = createSlackClient(context);
  slackClient.emit(WebClientEvent.RATE_LIMITED, 10);

  expect(infoFn).toHaveBeenCalledTimes(1);
  expect(infoFn).toHaveBeenCalledWith(
    {
      numSeconds: 10,
    },
    'A rate-limiting error occurred and the app is going to retry',
  );
});

test('should retry slack_webapi_platform_error 5 times', async () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>();
  const slackClient = createSlackClient(context);

  const err = platformErrorFromResult({ ok: false, error: '' });

  // eslint-disable-next-line @typescript-eslint/require-await
  const callback = jest.fn(async () => {
    throw err;
  });

  try {
    await slackClient.retryWebApiPlatformError(callback);
  } catch (e) {
    expect(e).toBe(err);
  }
  expect(callback).toHaveBeenCalledTimes(5);
});

test('should not retry slack_webapi_request_error', async () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>();
  const slackClient = createSlackClient(context);

  const err = requestErrorWithOriginal({ name: '', message: '' });

  // eslint-disable-next-line @typescript-eslint/require-await
  const callback = jest.fn(async () => {
    throw err;
  });

  await expect(slackClient.retryWebApiPlatformError(callback)).rejects.toThrow(
    err,
  );
  expect(callback).toHaveBeenCalledTimes(1);
});
