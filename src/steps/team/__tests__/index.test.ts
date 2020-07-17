import step from '../index';
import { Entity } from '@jupiterone/integration-sdk-core';
import { createMockStepExecutionContext } from '../../../../test/context';
import {
  SLACK_TEAM_TYPE,
  SLACK_TEAM_CLASS,
  toTeamEntityKey,
} from '../../../converters';

test('step data collection', async () => {
  const context = createMockStepExecutionContext();
  const { config } = context.instance;

  await step.executionHandler(context);

  const expectedEntity: Entity = {
    id: config.teamId,
    _type: SLACK_TEAM_TYPE,
    _class: [SLACK_TEAM_CLASS],
    _key: toTeamEntityKey(config.teamId),
    appId: config.appId,
    displayName: config.teamName,
    name: config.teamName,
    createdOn: undefined,
    _rawData: expect.any(Object),
  };

  expect(context.jobState.collectedEntities).toEqual([expectedEntity]);
  expect(context.jobState.collectedRelationships.length).toEqual(0);
});
