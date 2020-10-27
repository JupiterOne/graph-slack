import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import {
  WebClient,
  WebClientOptions,
  WebAPICallResult,
  UsersListArguments,
  ConversationsListArguments,
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

export class SlackWebClient extends WebClient {
  private integrationLogger: IntegrationLogger;

  constructor(
    logger: IntegrationLogger,
    token?: string,
    options?: WebClientOptions,
  ) {
    super(token, options);
    this.integrationLogger = logger;
  }

  async iterateUsers(
    callback: (user: SlackUser) => Promise<void>,
    options?: UsersListArguments,
  ): Promise<void> {
    let nextCursor: string | undefined = undefined;
    let totalUsers = 0;

    do {
      const listUsersResponse = await this.users.list({
        cursor: nextCursor,
        // Recommended limit max here: https://api.slack.com/methods/users.list
        //
        // If no limit is specified, then Slack will attempt to deliver the
        // entire set. For large organizations, you may receive a "limit_required"
        // error in the response or a 500 if no limit is specified.
        limit: 200,
        ...options,
      });

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

      nextCursor = listUsersResponse.response_metadata.next_cursor;
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
      const listChannelsResponse = await this.conversations.list({
        cursor: nextCursor,
        // Recommended limit max here: https://api.slack.com/methods/conversations.list
        //
        // If no limit is specified, then Slack will default to 100.
        limit: 200,
        ...options,
      });

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

      nextCursor = listChannelsResponse.response_metadata.next_cursor;
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
      const listChannelMembersResponse = await this.conversations.members({
        channel,
        cursor: nextCursor,
        // Recommended limit max here: https://api.slack.com/methods/conversations.members
        //
        // If no limit is specified, then Slack will default to 100.
        limit: 200,
      });

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

      nextCursor = listChannelMembersResponse.response_metadata.next_cursor;
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
