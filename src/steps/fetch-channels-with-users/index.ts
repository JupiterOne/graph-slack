import {
  IntegrationStep,
  createIntegrationRelationship,
  Relationship,
  JobState,
} from '@jupiterone/integration-sdk-core';

import { createSlackClient } from '../../provider';
import { SlackChannel } from '../../provider/types';
import { SlackWebClient } from '../../provider/SlackProvider';
import fetchUsersStep from '../fetch-users';
import {
  createChannelEntity,
  toChannelEntityKey,
  SLACK_CHANNEL_TYPE,
  toUserEntityKey,
  SLACK_USER_CLASS,
  SLACK_CHANNEL_HAS_USER_RELATIONSHIP,
} from '../../converters';
import { SlackIntegrationConfig } from '../../type';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'fetch-channels-with-users',
  name: 'Fetch channels and each user in the channel',
  types: [SLACK_CHANNEL_TYPE, SLACK_CHANNEL_HAS_USER_RELATIONSHIP],
  dependsOn: [fetchUsersStep.id],
  async executionHandler(context) {
    const { instance, jobState } = context;
    const client = createSlackClient(context);
    const channels = await client.listAllChannels();

    await jobState.addEntities(
      channels.map((channel: SlackChannel) =>
        createChannelEntity(instance.config.teamId, channel),
      ),
    );

    await addChannelUserRelationships({
      jobState,
      teamId: instance.config.teamId,
      client,
      channels,
    });
  },
};

export default step;

export async function addChannelUserRelationships({
  client,
  teamId,
  channels,
  jobState,
}: {
  client: SlackWebClient;
  teamId: string;
  channels: SlackChannel[];
  jobState: JobState;
}): Promise<void> {
  for (const channel of channels) {
    if (channel.num_members === 0) {
      // Attempting to list channel members of a channel with 0 members will
      // throw an error.
      continue;
    }

    const membersOfChannel = await client.listAllChannelMembers(channel.id);

    const relationships: Relationship[] = membersOfChannel.map((memberId) =>
      createIntegrationRelationship({
        _class: 'HAS',
        fromKey: toChannelEntityKey(teamId, channel),
        fromType: SLACK_CHANNEL_TYPE,
        toType: SLACK_USER_CLASS,
        toKey: toUserEntityKey({ teamId, userId: memberId }),
      }),
    );

    await jobState.addRelationships(relationships);
  }
}
