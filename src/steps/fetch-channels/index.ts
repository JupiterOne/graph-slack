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
      const channelEntity = createChannelEntity(
        instance.config.teamId,
        channel,
      );
      if (!channelEntity) {
        return;
      }

      // We occasionally see duplicate channels, but after
      // comparing the duplicate channels they matched exactly.
      // So, if we see the same key again we skip creation.
      if (!jobState.hasKey(channelEntity._key)) {
        await jobState.addEntity(channelEntity);
      } else {
        context.logger.debug(
          {
            channelId: channel.id,
          },
          'Skipping slack_channel creation',
        );
      }
    });
  },
};

export default step;
