import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { createSlackClient } from '../../provider';
import { SlackChannel } from '../../provider/types';
import {
  createChannelEntity,
  SLACK_CHANNEL_TYPE,
  SLACK_CHANNEL_CLASS,
  toChannelEntityKey,
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
      // We have been seeing duplicate channels returned from the API.
      // TODO: This is here for INT-3586. @zemberdotnet
      const key = toChannelEntityKey({
        teamId: instance.config.teamId,
        channelId: channel.id,
      });
      // Check if we have already created this channel.
      // If we have, then we log extra details
      if (jobState.hasKey(key)) {
        context.logger.warn('Duplicate channel found', {
          channelId: channel.id,
          active: channel.is_active,
          archived: channel.is_archived,
        });
      }

      await jobState.addEntity(
        createChannelEntity(instance.config.teamId, channel),
      );
    });
  },
};

export default step;
