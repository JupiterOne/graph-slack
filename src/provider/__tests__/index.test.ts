import {
  createMockStepExecutionContext,
  createMockIntegrationLogger,
} from '@jupiterone/integration-sdk-testing';
import { createSlackClient } from '../';
import { WebClientEvent } from '@slack/web-api';
import { SlackIntegrationConfig } from '../../type';

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
