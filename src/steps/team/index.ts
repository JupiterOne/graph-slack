import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createTeamEntity } from './converter';
import { SlackIntegrationConfig } from '../../type';
import { Entities, Steps } from '../../constants';

async function fetchTeam(
  context: IntegrationStepExecutionContext<SlackIntegrationConfig>,
) {
  const {
    instance: { config },
    jobState,
  } = context;

  await jobState.addEntity(
    createTeamEntity({
      teamId: config.teamId,
      teamName: config.teamName,
      appId: config.appId,
    }),
  );
}

export const teamSteps: IntegrationStep<SlackIntegrationConfig>[] = [
  {
    id: Steps.FETCH_TEAM,
    name: 'Ingest Slack Team',
    entities: [Entities.TEAM],
    relationships: [],
    executionHandler: fetchTeam,
  },
];
