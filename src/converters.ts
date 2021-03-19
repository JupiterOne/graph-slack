import { SlackChannel, SlackUser } from './provider/types';
import {
  createIntegrationEntity,
  Entity,
  createDirectRelationship,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

export const SLACK_TEAM_TYPE = 'slack_team';
export const SLACK_TEAM_CLASS = 'Account';
export const SLACK_USER_TYPE = 'slack_user';
export const SLACK_USER_CLASS = 'User';
export const SLACK_CHANNEL_TYPE = 'slack_channel';
export const SLACK_CHANNEL_CLASS = 'Channel';

export const SLACK_TEAM_HAS_USER_RELATIONSHIP = 'slack_team_has_User';
export const SLACK_CHANNEL_HAS_USER_RELATIONSHIP = 'slack_channel_has_User';

export function createTeamEntity(teamData: {
  teamId: string;
  teamName: string;
  appId: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: teamData,
      assign: {
        _key: toTeamEntityKey(teamData.teamId),
        _type: SLACK_TEAM_TYPE,
        _class: SLACK_TEAM_CLASS,
        id: teamData.teamId,
        displayName: teamData.teamName,
        name: teamData.teamName,
        appId: teamData.appId,
      },
    },
  });
}

export function toTeamEntityKey(teamId: string): string {
  return `slack-team:${teamId}`;
}

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
        userId: user.id,
        username: user.name,
        realName: user.real_name,
        displayName:
          /* istanbul ignore next */
          (!!user.profile.display_name && user.profile.display_name) ||
          (!!user.real_name && user.real_name) ||
          (!!user.name && user.name) ||
          user.id,
        email: user.profile.email,
        emailDomain: user.profile.email?.split('@').pop(),
        bot: user.profile.is_bot === true,
        mfaEnabled: user.has_2fa === true,
        admin: user.is_admin === true || user.is_owner === true,
        teamAdmin: user.is_admin === true,
        teamOwner: user.is_owner === true,
        primaryTeamOwner: user.is_primary_owner === true,
        restricted: user.is_restricted === true,
        ultraRestricted: user.is_ultra_restricted === true,
        active: user.deleted !== true,
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
        _key: toChannelEntityKey({ teamId, channelId: channel.id }),
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
        active: channel.is_archived !== true,
        archived: channel.is_archived === true,
        private: channel.is_private === true,
        public: channel.is_private !== true,
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

export function toChannelEntityKey({
  teamId,
  channelId,
}: {
  teamId: string;
  channelId: string;
}): string {
  return `slack-channel:team_${teamId}:channel_${channelId}`;
}

export function createTeamHasUserRelationship({
  teamId,
  userEntity,
}: {
  teamId: string;
  userEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    fromKey: toTeamEntityKey(teamId),
    fromType: SLACK_TEAM_TYPE,
    toType: SLACK_USER_CLASS,
    toKey: userEntity._key,
  });
}
