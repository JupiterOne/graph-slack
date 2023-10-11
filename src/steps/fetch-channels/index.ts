import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { createSlackClient } from '../../provider';
import { SlackChannel } from '../../provider/types';
import { createChannelEntity, toChannelEntityKey } from './converter';
import { SlackIntegrationConfig } from '../../type';
import {
  Entities,
  IngestionSources,
  Relationships,
  Steps,
} from '../../constants';
import { toUserEntityKey } from '../fetch-users/converter';

async function fetchChannels(
  context: IntegrationStepExecutionContext<SlackIntegrationConfig>,
) {
  const { instance, jobState, logger } = context;
  const client = createSlackClient(context);
  await client.iterateChannels(async (channel: SlackChannel) => {
    const channelEntity = createChannelEntity(instance.config.teamId, channel);
    if (!channelEntity) {
      return;
    }

    // We occasionally see duplicate channels, but after
    // comparing the duplicate channels they matched exactly.
    // So, if we see the same key again we skip creation.
    if (!jobState.hasKey(channelEntity._key)) {
      await jobState.addEntity(channelEntity);
    } else {
      logger.debug(
        {
          channelId: channel.id,
        },
        'Skipping slack_channel creation',
      );
    }
  });
}

async function buildChannelHasMemberRelationship(
  context: IntegrationStepExecutionContext<SlackIntegrationConfig>,
) {
  const { instance, jobState } = context;
  const { teamId } = instance.config;
  const client = createSlackClient(context);

  await jobState.iterateEntities(
    {
      _type: Entities.CHANNEL._type,
    },
    async (channelEntity) => {
      if (channelEntity.numMembers === 0) {
        // Attempting to list channel members of a channel with 0 members will
        // throw an error.
        return;
      }

      const channelId = channelEntity.id;

      if (!channelId || typeof channelId !== 'string') {
        return;
      }

      await client.iterateChannelMembers(
        channelId,
        async (channelMemberId: string) => {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              fromType: Entities.CHANNEL._type,
              fromKey: toChannelEntityKey({
                teamId,
                channelId,
              }),
              toType: Entities.USER._type,
              toKey: toUserEntityKey({
                teamId,
                userId: channelMemberId,
              }),
            }),
          );
        },
      );
    },
  );
}

export const channelSteps: IntegrationStep<SlackIntegrationConfig>[] = [
  {
    id: Steps.FETCH_CHANNELS,
    name: 'Fetch channels without users',
    entities: [Entities.CHANNEL],
    relationships: [],
    ingestionSourceId: IngestionSources.CHANNELS,
    executionHandler: fetchChannels,
  },
  {
    id: Steps.BUILD_CHANNEL_MEMBER_RELATIONSHIPS,
    name: 'Build Channel HAS User Relationship',
    entities: [],
    relationships: [Relationships.CHANNEL_HAS_USER],
    dependsOn: [Steps.FETCH_CHANNELS, Steps.FETCH_USERS],
    ingestionSourceId: IngestionSources.CHANNEL_MEMBERS,
    executionHandler: buildChannelHasMemberRelationship,
  },
];
