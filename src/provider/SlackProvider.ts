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
  constructor(token?: string, options?: WebClientOptions) {
    super(token, options);
  }

  async iterateUsers(
    callback: (user: SlackUser) => Promise<void>,
    options?: UsersListArguments,
  ): Promise<void> {
    let nextCursor: string | undefined = undefined;

    do {
      const listUsersResponse = await this.users.list({
        cursor: nextCursor,
        ...options,
      });

      for (const user of listUsersResponse.members) {
        await callback(user);
      }

      nextCursor = listUsersResponse.response_metadata.next_cursor;
    } while (nextCursor);
  }

  async iterateChannels(
    callback: (channel: SlackChannel) => Promise<void>,
    options?: ConversationsListArguments,
  ): Promise<void> {
    let nextCursor: string | undefined = undefined;

    do {
      const listChannelsResponse = await this.conversations.list({
        cursor: nextCursor,
        ...options,
      });

      for (const channel of listChannelsResponse.channels) {
        await callback(channel);
      }

      nextCursor = listChannelsResponse.response_metadata.next_cursor;
    } while (nextCursor);
  }

  async iterateChannelMembers(
    channel: string,
    callback: (member: string) => Promise<void>,
  ): Promise<void> {
    let nextCursor: string | undefined = undefined;

    do {
      const listChannelMembersResponse = await this.conversations.members({
        channel,
        cursor: nextCursor,
      });

      for (const member of listChannelMembersResponse.members) {
        await callback(member);
      }

      nextCursor = listChannelMembersResponse.response_metadata.next_cursor;
    } while (nextCursor);
  }
}
