import { SlackChannel, SlackUser } from './provider/types';
import { createIntegrationEntity, Entity } from '@jupiterone/integration-sdk';

export const SLACK_USER_TYPE = 'slack_user';
export const SLACK_USER_CLASS = 'User';
export const SLACK_CHANNEL_TYPE = 'slack_channel';
export const SLACK_CHANNEL_CLASS = 'Channel';

export function createUserEntity(teamId: string, user: SlackUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: toUserEntityKey({ teamId, userId: user.id }),
        _type: SLACK_USER_TYPE,
        _class: SLACK_USER_CLASS,

        // Normalize property names to match data model

        // NOTE: Slack _does not_ recommend the use of `user.name` and has moved
        // away from the concept of "usernames" to "display names".
        username: user.id,
        displayName: user.id,
        email: user.profile.email,
        isBot: user.profile.is_bot === true,
        mfaEnabled: user.has_2fa === true,
        isAdmin: user.is_admin === true,
        isOwner: user.is_owner === true,
        isPrimaryOwner: user.is_primary_owner === true,
        isRestricted: user.is_restricted === true,
        isUltraRestricted: user.is_ultra_restricted === true,
        updatedOn: user.updated,
      },
    },
  });
}

export function toUserEntityKey({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}): string {
  return `slack-user:team_${teamId}:user_${userId}`;
}

export function createChannelEntity(
  teamId: string,
  channel: SlackChannel,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: channel,
      assign: {
        _key: toChannelEntityKey(teamId, channel),
        _type: SLACK_CHANNEL_TYPE,
        _class: SLACK_CHANNEL_CLASS,

        createdOn: channel.created,

        id: channel.id,
        name: channel.name,
        isChannel: channel.is_channel === true,
        isGroup: channel.is_group === true,
        isIm: channel.is_im === true,
        creator: channel.creator,
        isArchived: channel.is_archived === true,
        isMember: channel.is_member === true,
        isPrivate: channel.is_private === true,
        isMpim: channel.is_mpim === true,
        topic: channel.topic.value,
        topicCreator: channel.topic.creator,
        topicLastSet: channel.topic.last_set,
        purpose: channel.purpose.value,
        purposeCreator: channel.purpose.creator,
        purposeLastSet: channel.purpose.last_set,
        numMembers: channel.num_members,
      },
    },
  });
}

export function toChannelEntityKey(
  teamId: string,
  channel: SlackChannel,
): string {
  return `slack-channel:team_${teamId}:channel_${channel.id}`;
}
