import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { createSlackClient } from '../../provider';
import { SlackChannel } from '../../provider/types';
import { createChannelEntity, SLACK_CHANNEL_TYPE } from '../../converters';
import { SlackIntegrationConfig } from '../../type';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'fetch-channels',
  name: 'Fetch channels without users',
  types: [SLACK_CHANNEL_TYPE],
  async executionHandler(context) {
    const { instance, jobState } = context;
    const client = createSlackClient(context);
    await client.iterateChannels(async (channel: SlackChannel) => {
      await jobState.addEntity(
        createChannelEntity(instance.config.teamId, channel),
      );
    });
  },
};

export default step;
