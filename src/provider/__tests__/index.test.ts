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

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

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

  jest.useFakeTimers();
  slackClient.retryWebApiPlatformError(callback).catch((e) => {
    expect(e).toBe(err);
  });

  for (const _ of Array(5)) {
    /**
     * The `retryWebApiPlatformError` function is designed to retry 5 times
     * before failing.
     *
     * Each iteration of `retryWebApiPlatformError()` requires four promises
     * to be resolved, and one timer to resolve:
     *   - await slackClient.retryWebApiPlatformError()
     *   - await @lifeomic/attempt.retry(attemptFunc)
     *   - await attemptFunc()
     *   - await sleep() [also requires a timer to resolve]
     *
     * For each retry, we must resolve all four promises _and_ run the sleep()
     * timer to completion. Only then will the failed callback trigger another
     * retry.
     */
    jest.runAllTimers();
    await flushPromises();
  }
  expect(callback).toHaveBeenCalledTimes(5);
  jest.useRealTimers();
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
