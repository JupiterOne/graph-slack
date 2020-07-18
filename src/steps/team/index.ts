import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { SLACK_TEAM_TYPE, createTeamEntity } from '../../converters';
import { SlackIntegrationConfig } from '../../type';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'team',
  name: 'Ingest Slack Team',
  types: [SLACK_TEAM_TYPE],
  async executionHandler(context) {
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
  },
};

export default step;
