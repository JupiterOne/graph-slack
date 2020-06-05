import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { SLACK_CHANNEL_TYPE, SLACK_CHANNEL_CLASS } from '../../../converters';
import { setupRecording } from '../../../../test/recording';

import step from '../index';
import { Entity } from '@jupiterone/integration-sdk-core';
import { matchesSlackChannelKey } from '../../../../test/slack';
import { SlackIntegrationConfig } from '../../../type';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetch-channels',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities.length).toBeGreaterThan(0);
  expect(context.jobState.collectedRelationships.length).toEqual(0);

  const expectedCollectedEntities: Entity[] = context.jobState.collectedEntities.map(
    (entity: Entity) => {
      return expect.objectContaining({
        ...entity,
        isChannel: expect.any(Boolean),
        isGroup: expect.any(Boolean),
        isIm: expect.any(Boolean),
        creator: expect.any(String),
        isArchived: expect.any(Boolean),
        isMember: expect.any(Boolean),
        isPrivate: expect.any(Boolean),
        isMpim: expect.any(Boolean),

        topic: expect.any(String),
        topicCreator: expect.any(String),
        topicLastSet: expect.any(Number),

        purpose: expect.any(String),
        purposeCreator: expect.any(String),
        purposeLastSet: expect.any(Number),

        numMembers: expect.any(Number),

        id: expect.any(String),
        name: expect.any(String),
        _key: matchesSlackChannelKey(),
        _type: SLACK_CHANNEL_TYPE,
        _class: [SLACK_CHANNEL_CLASS],
        _rawData: expect.any(Array),
        displayName: entity.name,
      });
    },
  );

  expect(context.jobState.collectedEntities).toEqual(expectedCollectedEntities);
});
