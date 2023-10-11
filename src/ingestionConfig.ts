import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { IngestionSources } from './constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [IngestionSources.CHANNELS]: {
    title: 'Channels',
    description: 'Ingest Slack Channels',
  },
  [IngestionSources.USERS]: {
    title: 'Users',
    description: 'Ingest Slack Users',
  },
  [IngestionSources.CHANNEL_MEMBERS]: {
    title: 'Channel Members',
    description:
      'Fetch channel members and create Channel->HAS->User relationships',
  },
};
