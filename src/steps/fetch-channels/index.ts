import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk';

import { createSlackClient } from '../../provider';
import { SlackChannel } from '../../provider/types';
import { createChannelEntity, SLACK_CHANNEL_TYPE } from '../../converters';

const step: IntegrationStep = {
  id: 'fetch-channels',
  name: 'Fetch channels without users',
  types: [SLACK_CHANNEL_TYPE],
  async executionHandler(context: IntegrationStepExecutionContext) {
    const { instance, jobState } = context;
    const client = createSlackClient(context);
    const channels = await client.listAllChannels();

    await jobState.addEntities(
      channels.map((channel: SlackChannel) =>
        createChannelEntity(instance.config.teamId, channel),
      ),
    );
  },
};

export default step;
