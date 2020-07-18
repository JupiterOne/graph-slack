import { IntegrationStep } from '@jupiterone/integration-sdk-core';

import { createSlackClient } from '../../provider';
import { SlackUser } from '../../provider/types';
import {
  createUserEntity,
  SLACK_USER_TYPE,
  createTeamHasUserRelationship,
  SLACK_TEAM_HAS_USER_RELATIONSHIP,
} from '../../converters';
import { SlackIntegrationConfig } from '../../type';
import teamStep from '../team';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'fetch-users',
  name: 'Fetch Users',
  types: [SLACK_USER_TYPE, SLACK_TEAM_HAS_USER_RELATIONSHIP],
  dependsOn: [teamStep.id],
  async executionHandler(context) {
    const { instance, jobState } = context;

    const client = createSlackClient(context);
    const members = await client.listAllUsers();

    const userEntities = members.map((user: SlackUser) =>
      createUserEntity(instance.config.teamId, user),
    );

    await jobState.addEntities(userEntities);
    await jobState.addRelationships(
      userEntities.map((userEntity) =>
        createTeamHasUserRelationship({
          teamId: instance.config.teamId,
          userEntity,
        }),
      ),
    );
  },
};

export default step;
