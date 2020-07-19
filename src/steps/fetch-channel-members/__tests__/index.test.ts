import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupRecording } from '../../../../test/recording';
import fetchChannelsStep from '../../fetch-channels';
import step from '../index';
import { Relationship } from '@jupiterone/integration-sdk-core';
import {
  matchesSlackChannelUserRelationshipKey,
  matchesSlackChannelKey,
  matchesSlackUserKey,
} from '../../../../test/slack';
import { SlackIntegrationConfig } from '../../../type';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetch-channel-members',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>();

  await fetchChannelsStep.executionHandler(context);
  await step.executionHandler(context);

  expect(context.jobState.collectedRelationships.length).toBeGreaterThan(0);

  const expectedCollectedRelationships: Relationship[] = context.jobState.collectedRelationships.map(
    () => {
      return {
        _key: matchesSlackChannelUserRelationshipKey(),
        _type: 'slack_channel_has_User',
        _class: 'HAS',
        _fromEntityKey: matchesSlackChannelKey(),
        _toEntityKey: matchesSlackUserKey(),
        _mapping: undefined,
        displayName: 'HAS',
      };
    },
  );

  expect(context.jobState.collectedRelationships).toEqual(
    expectedCollectedRelationships,
  );
});
