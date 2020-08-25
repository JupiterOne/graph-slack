import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import {
  SLACK_TEAM_TYPE,
  createTeamEntity,
  SLACK_TEAM_CLASS,
} from '../../converters';
import { SlackIntegrationConfig } from '../../type';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'team',
  name: 'Ingest Slack Team',
  entities: [
    {
      resourceName: 'Team',
      _type: SLACK_TEAM_TYPE,
      _class: SLACK_TEAM_CLASS,
    },
  ],
  relationships: [],
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
