import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { createSlackClient } from '../../provider';
import { SlackChannel } from '../../provider/types';
import {
  createChannelEntity,
  SLACK_CHANNEL_TYPE,
  SLACK_CHANNEL_CLASS,
} from '../../converters';
import { SlackIntegrationConfig } from '../../type';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'fetch-channels',
  name: 'Fetch channels without users',
  entities: [
    {
      resourceName: 'Channel',
      _type: SLACK_CHANNEL_TYPE,
      _class: SLACK_CHANNEL_CLASS,
    },
  ],
  relationships: [],
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
