import { retry } from '@lifeomic/attempt';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import {
  WebClient,
  WebClientOptions,
  WebAPICallResult,
  UsersListArguments,
  ConversationsListArguments,
  ErrorCode,
} from '@slack/web-api';
import { SlackUser, SlackChannel } from './types';

export interface CreateSlackWebClientParams {
  accessToken: string;
}

export interface ListUsersResult extends WebAPICallResult {
  members: SlackUser[];
}

export interface ListChannelMembersResult extends WebAPICallResult {
  members: string[];
}

export interface ListChannelsResult extends WebAPICallResult {
  channels: SlackChannel[];
}

const retryOptions = {
  retries: 5,
  factor: 1.75, // 1, 1.75, 3.06, 5.35, 9.38
  minTimeout: 1000,
  maxTimeout: 10000,
  randomize: false,
};

export class SlackWebClient extends WebClient {
  private integrationLogger: IntegrationLogger;

  constructor(logger: IntegrationLogger, token: string) {
    const webClientOptions: WebClientOptions = {
      /**
       * The slack client takes optional `logger` and `logLevel` arguments in order to
       * print some of its own logs. We may want to enable this in the future.
       */
      // logger: {
      //   ...logger,
      //   getLevel: () => logLevel,
      //   // eslint-disable-next-line @typescript-eslint/no-empty-function
      //   setLevel: () => {},
      //   // eslint-disable-next-line @typescript-eslint/no-empty-function
      //   setName: () => {},
      // },
      // logLevel,
      /**
       * The Slack web client allows a set of retry options to retry errors thrown during
       * axios.post requests.
       *
       * However, these retry configurations do not handle the following bad requests:
       *   - 429: The Slack nodejs client parses the `retry-after` header and waits to retry
       *
       *   - !== 200: The Slack nodejs client states that "Slack's Web API doesn't use meaningful
       *     status codes besides 429 and 200". When the API returns a non-200 status, the client
       *     throws an error with the code "slack_webapi_platform_error". These errors are _not_
       *     handled by the proceeding retry policy, and we explicitly handle these with a separate
       *     slackWebApiPlatformErrorRetryPolicy.
       *
       * For more information, see the Slack nodejs client documentation:
       * https://github.com/slackapi/node-slack-sdk/tree/main/packages/web-api
       */
      retryConfig: retryOptions,
    };

    super(token, webClientOptions);
    this.integrationLogger = logger;
  }

  async retryWebApiPlatformError<T>(callback: () => Promise<T>) {
    return retry(callback, {
      delay: retryOptions.minTimeout,
      maxAttempts: retryOptions.retries,
      jitter: retryOptions.randomize,
      factor: retryOptions.factor,
      minDelay: retryOptions.minTimeout,
      maxDelay: retryOptions.maxTimeout,
      handleError: (err, context) => {
        if (err.code === ErrorCode.PlatformError) {
          this.integrationLogger.warn(
            {
              err,
            },
            'API call returned retryable Slack Platform Error',
          );
        } else {
          context.abort();
        }
      },
    });
  }

  async iterateUsers(
    callback: (user: SlackUser) => Promise<void>,
    options?: UsersListArguments,
  ): Promise<void> {
    let nextCursor: string | undefined = undefined;
    let totalUsers = 0;

    do {
      const listUsersResponse = (await this.retryWebApiPlatformError(
        async () => {
          return this.users.list({
            cursor: nextCursor,
            // Recommended limit max here: https://api.slack.com/methods/users.list
            //
            // If no limit is specified, then Slack will attempt to deliver the
            // entire set. For large organizations, you may receive a "limit_required"
            // error in the response or a 500 if no limit is specified.
            limit: 200,
            ...options,
          });
        },
      )) as WebAPICallResult & { members: any[] };

      const numUsersOnPage = listUsersResponse.members.length;
      this.integrationLogger.info(
        {
          users: numUsersOnPage,
        },
        'Page of users',
      );

      for (const user of listUsersResponse.members) {
        await callback(user);
      }

      nextCursor = listUsersResponse.response_metadata!.next_cursor;
      totalUsers += listUsersResponse.members.length;
    } while (nextCursor);

    this.integrationLogger.info(
      {
        totalUsers,
      },
      'Total users iterated',
    );
  }

  async iterateChannels(
    callback: (channel: SlackChannel) => Promise<void>,
    options?: ConversationsListArguments,
  ): Promise<void> {
    let nextCursor: string | undefined = undefined;
    let totalChannels = 0;

    do {
      const listChannelsResponse = (await this.retryWebApiPlatformError(
        async () => {
          return this.conversations.list({
            cursor: nextCursor,
            // Recommended limit max here: https://api.slack.com/methods/conversations.list
            //
            // If no limit is specified, then Slack will default to 100.
            limit: 200,
            ...options,
          });
        },
      )) as WebAPICallResult & { channels: any[] };

      const numChannelsOnPage = listChannelsResponse.channels.length;
      this.integrationLogger.info(
        {
          channels: numChannelsOnPage,
        },
        'Page of channels',
      );

      for (const channel of listChannelsResponse.channels) {
        await callback(channel);
      }

      nextCursor = listChannelsResponse.response_metadata!.next_cursor;
      totalChannels += numChannelsOnPage;
    } while (nextCursor);

    this.integrationLogger.info(
      {
        totalChannels,
      },
      'Total channels iterated',
    );
  }

  async iterateChannelMembers(
    channel: string,
    callback: (member: string) => Promise<void>,
  ): Promise<void> {
    let nextCursor: string | undefined = undefined;
    let totalChannelMembers = 0;

    do {
      const listChannelMembersResponse = (await this.retryWebApiPlatformError(
        async () => {
          return this.conversations.members({
            channel,
            cursor: nextCursor,
            // Recommended limit max here: https://api.slack.com/methods/conversations.members
            //
            // If no limit is specified, then Slack will default to 100.
            limit: 200,
          });
        },
      )) as WebAPICallResult & { members: any[] };

      const numChannelMembersOnPage = listChannelMembersResponse.members.length;
      this.integrationLogger.info(
        {
          members: numChannelMembersOnPage,
        },
        'Page of channel members',
      );

      for (const member of listChannelMembersResponse.members) {
        await callback(member);
      }

      nextCursor = listChannelMembersResponse.response_metadata!.next_cursor;
      totalChannelMembers += numChannelMembersOnPage;
    } while (nextCursor);

    this.integrationLogger.info(
      {
        totalChannelMembers,
      },
      'Total channel members iterated',
    );
  }
}
