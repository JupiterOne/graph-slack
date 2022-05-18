import {
  Entity,
  getRawData,
  IntegrationStep,
} from '@jupiterone/integration-sdk-core';
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
        const existingChannel = (await jobState.findEntity(key)) as Entity;
        const rawData = getRawData<SlackChannel>(existingChannel);

        context.logger.warn('Duplicate channel found. Diff:', {
          isChannel: channel.is_channel === rawData.is_channel,
          isArchived: channel.is_archived === rawData.is_archived,
          topicLastSet: channel.topic.last_set === rawData.topic.last_set,
          purposeLastSet: channel.purpose.last_set === rawData.purpose.last_set,
          numMembers: channel.num_members === rawData.num_members,
          prevNamesNum:
            channel.previous_names.length === rawData.previous_names.length,
          objectDiff: JSON.stringify(channel) === JSON.stringify(rawData),
        });
      }

      await jobState.addEntity(
        createChannelEntity(instance.config.teamId, channel),
      );
    });
  },
};

export default step;
