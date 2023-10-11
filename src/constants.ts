import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const IngestionSources = {
  CHANNELS: 'channels',
  USERS: 'users',
  CHANNEL_MEMBERS: 'channel_members',
};

export const Steps = {
  FETCH_TEAM: 'fetch-team',
  FETCH_CHANNELS: 'fetch-channels',
  BUILD_CHANNEL_MEMBER_RELATIONSHIPS: 'build-channel-member-relationships',
  FETCH_USERS: 'fetch-users',
};

export const Entities: Record<'CHANNEL' | 'USER' | 'TEAM', StepEntityMetadata> =
  {
    CHANNEL: {
      resourceName: 'Channel',
      _type: 'slack_channel',
      _class: ['Channel'],
    },
    USER: {
      resourceName: 'User',
      _type: 'slack_user',
      _class: ['User'],
    },
    TEAM: {
      resourceName: 'Team',
      _type: 'slack_team',
      _class: ['Account'],
    },
  };

export const Relationships: Record<
  'CHANNEL_HAS_USER' | 'TEAM_HAS_USER',
  StepRelationshipMetadata
> = {
  CHANNEL_HAS_USER: {
    _type: 'slack_channel_has_user',
    sourceType: Entities.CHANNEL._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  TEAM_HAS_USER: {
    _type: 'slack_team_has_user',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
