import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../../constants';
import { SlackChannel } from '../../provider/types';

export function toChannelEntityKey({
  teamId,
  channelId,
}: {
  teamId: string;
  channelId: string;
}): string {
  return `slack-channel:team_${teamId}:channel_${channelId}`;
}

export function createChannelEntity(
  teamId: string,
  channel: SlackChannel,
): Entity | undefined {
  if (!channel.id) {
    return;
  }

  return createIntegrationEntity({
    entityData: {
      source: channel,
      assign: {
        _key: toChannelEntityKey({ teamId, channelId: channel.id }),
        _type: Entities.CHANNEL._type,
        _class: Entities.CHANNEL._class,

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
        topic: channel.topic?.value,
        topicCreator: channel.topic?.creator,
        topicLastSet: channel.topic?.last_set,
        purpose: channel.purpose?.value,
        purposeCreator: channel.purpose?.creator,
        purposeLastSet: channel.purpose?.last_set,
        numMembers: channel.num_members,
        teamId: teamId,
      },
    },
  });
}
