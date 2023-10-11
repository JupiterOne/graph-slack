import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupSlackRecording } from '../../../../test/recording';

import { Relationship } from '@jupiterone/integration-sdk-core';
import {
  matchesSlackChannelKey,
  matchesSlackChannelUserRelationshipKey,
  matchesSlackUserKey,
} from '../../../../test/slack';
import { Steps } from '../../../constants';
import { buildStepTestConfig } from '../../../../test/config';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe(Steps.FETCH_CHANNELS, () => {
  test('success', async () => {
    recording = setupSlackRecording({
      directory: __dirname,
      name: Steps.FETCH_CHANNELS,
    });

    const stepConfig = buildStepTestConfig(Steps.FETCH_CHANNELS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});

describe(Steps.BUILD_CHANNEL_MEMBER_RELATIONSHIPS, () => {
  test('success', async () => {
    recording = setupSlackRecording({
      directory: __dirname,
      name: Steps.BUILD_CHANNEL_MEMBER_RELATIONSHIPS,
    });

    const stepConfig = buildStepTestConfig(
      Steps.BUILD_CHANNEL_MEMBER_RELATIONSHIPS,
    );
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
    const expectedCollectedRelationships: Relationship[] =
      stepResults.collectedRelationships.map(() => {
        return {
          _key: matchesSlackChannelUserRelationshipKey(),
          _type: 'slack_channel_has_user',
          _class: 'HAS',
          _fromEntityKey: matchesSlackChannelKey(),
          _toEntityKey: matchesSlackUserKey(),
          _mapping: undefined,
          displayName: 'HAS',
        };
      });

    expect(stepResults.collectedRelationships).toEqual(
      expectedCollectedRelationships,
    );
  });
});
