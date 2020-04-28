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

  async listAllUsers(options?: UsersListArguments): Promise<SlackUser[]> {
    let members: SlackUser[] = [];
    let nextCursor: string;

    do {
      const listUsersResponse = await this.users.list({
        cursor: nextCursor,
        ...options,
      });

      members = members.concat(listUsersResponse.members);
      nextCursor = listUsersResponse.response_metadata.next_cursor;
    } while (nextCursor);

    return members;
  }

  async listAllChannels(
    options?: ConversationsListArguments,
  ): Promise<SlackChannel[]> {
    let channels: SlackChannel[] = [];
    let nextCursor: string;

    do {
      const listChannelsResponse = await this.conversations.list({
        cursor: nextCursor,
        ...options,
      });

      channels = channels.concat(listChannelsResponse.channels);
      nextCursor = listChannelsResponse.response_metadata.next_cursor;
    } while (nextCursor);

    return channels;
  }

  async listAllChannelMembers(channel: string): Promise<string[]> {
    let members: string[] = [];
    let nextCursor: string;

    do {
      const listChannelMembersResponse = await this.conversations.members({
        channel,
        cursor: nextCursor,
      });

      members = members.concat(listChannelMembersResponse.members as string[]);
      nextCursor = listChannelMembersResponse.response_metadata.next_cursor;
    } while (nextCursor);

    return members;
  }
}
