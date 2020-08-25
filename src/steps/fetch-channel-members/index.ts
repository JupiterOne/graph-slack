import {
  IntegrationStep,
  createDirectRelationship,
  RelationshipClass,
  Entity,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createSlackClient } from '../../provider';
import { SlackWebClient } from '../../provider/SlackProvider';
import fetchChannelsStep from '../fetch-channels';
import fetchUsersStep from '../fetch-users';
import {
  toChannelEntityKey,
  SLACK_CHANNEL_TYPE,
  toUserEntityKey,
  SLACK_USER_CLASS,
  SLACK_CHANNEL_HAS_USER_RELATIONSHIP,
  SLACK_CHANNEL_CLASS,
  SLACK_USER_TYPE,
} from '../../converters';
import { SlackIntegrationConfig } from '../../type';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'fetch-channel-members',
  name: 'Fetch channels and each user in the channel',
  entities: [
    {
      resourceName: 'Channel',
      _type: SLACK_CHANNEL_TYPE,
      _class: SLACK_CHANNEL_CLASS,
    },
  ],
  relationships: [
    {
      _class: RelationshipClass.HAS,
      _type: SLACK_CHANNEL_HAS_USER_RELATIONSHIP,
      sourceType: SLACK_CHANNEL_TYPE,
      targetType: SLACK_USER_TYPE,
    },
  ],
  dependsOn: [fetchChannelsStep.id, fetchUsersStep.id],
  async executionHandler(context) {
    const { instance, jobState } = context;
    const client = createSlackClient(context);

    await jobState.iterateEntities(
      {
        _type: SLACK_CHANNEL_TYPE,
      },
      (channelEntity: Entity) =>
        addChannelUserRelationships({
          context,
          teamId: instance.config.teamId,
          client,
          channelEntity,
        }),
    );
  },
};

export default step;

async function addChannelUserRelationships({
  context,
  client,
  teamId,
  channelEntity,
}: {
  context: IntegrationStepExecutionContext<SlackIntegrationConfig>;
  client: SlackWebClient;
  teamId: string;
  channelEntity: Entity;
}): Promise<void> {
  if (channelEntity.numMembers === 0) {
    // Attempting to list channel members of a channel with 0 members will
    // throw an error.
    return;
  }

  const { jobState } = context;
  const channelId = channelEntity.id as string;

  await client.iterateChannelMembers(channelId, (channelMemberId: string) =>
    jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        fromKey: toChannelEntityKey({ teamId, channelId }),
        fromType: SLACK_CHANNEL_TYPE,
        toType: SLACK_USER_CLASS,
        toKey: toUserEntityKey({ teamId, userId: channelMemberId }),
      }),
    ),
  );
}
