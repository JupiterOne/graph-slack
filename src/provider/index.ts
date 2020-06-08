import { IntegrationExecutionContext } from '@jupiterone/integration-sdk-core';
import { SlackWebClient } from './SlackProvider';
import { WebClientEvent } from '@slack/web-api';
import { SlackIntegrationConfig } from '../type';

export const USERS_READ_SCOPE = 'users:read';
export const CHANNELS_READ_SCOPE = 'channels:read';

/**
 * Creates a Slack client from an integration instance
 */
export function createSlackClient(
  context: IntegrationExecutionContext<SlackIntegrationConfig>,
): SlackWebClient {
  const slackWebClient = new SlackWebClient(
    context.instance.config.accessToken,
    {
      retryConfig: {
        retries: 10,
        minTimeout: 200,
        maxTimeout: 1000,
      },
    },
  );

  slackWebClient.on(WebClientEvent.RATE_LIMITED, (numSeconds) => {
    context.logger.warn(
      {
        numSeconds,
      },
      'A rate-limiting error occurred and the app is going to retry',
    );
  });

  return slackWebClient;
}
