import { Recording } from '@jupiterone/integration-sdk-testing';
import { createMockStepExecutionContext } from '../../../../test/context';
import {
  SLACK_USER_TYPE,
  SLACK_USER_CLASS,
  createTeamHasUserRelationship,
} from '../../../converters';
import { setupRecording } from '../../../../test/recording';

import step from '../index';
import { Entity, Relationship } from '@jupiterone/integration-sdk-core';
import { matchesSlackUserKey } from '../../../../test/slack';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetch-users',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities.length).toBeGreaterThan(0);
  expect(context.jobState.collectedRelationships.length).toBeGreaterThan(0);

  const expectedCollectedEntities: Entity[] = context.jobState.collectedEntities.map(
    (entity: Entity) => {
      return expect.objectContaining({
        ...entity,
        username: expect.any(String),
        mfaEnabled: expect.any(Boolean),
        bot: expect.any(Boolean),
        teamAdmin: expect.any(Boolean),
        teamOwner: expect.any(Boolean),
        primaryTeamOwner: expect.any(Boolean),
        restricted: expect.any(Boolean),
        ultraRestricted: expect.any(Boolean),
        active: expect.any(Boolean),
        updatedOn: expect.any(Number),
        id: expect.any(String),
        name: expect.any(String),
        _key: matchesSlackUserKey(),
        _type: SLACK_USER_TYPE,
        _class: [SLACK_USER_CLASS],
        _rawData: expect.any(Array),
        displayName: entity.id,
      });
    },
  );

  expect(context.jobState.collectedEntities).toEqual(expectedCollectedEntities);

  const expectedCollectedRelationships: Relationship[] = context.jobState.collectedEntities.map(
    (userEntity) =>
      createTeamHasUserRelationship({
        teamId: context.instance.config.teamId,
        userEntity,
      }),
  );

  expect(context.jobState.collectedRelationships).toEqual(
    expectedCollectedRelationships,
  );
});
