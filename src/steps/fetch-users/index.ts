import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createSlackClient } from '../../provider';
import { SlackUser } from '../../provider/types';
import { createUserEntity, createTeamHasUserRelationship } from './converter';
import { SlackIntegrationConfig } from '../../type';
import {
  Entities,
  IngestionSources,
  Relationships,
  Steps,
} from '../../constants';

async function fetchUsers(
  context: IntegrationStepExecutionContext<SlackIntegrationConfig>,
) {
  const { instance, jobState } = context;
  const client = createSlackClient(context);

  await client.iterateUsers(async (user: SlackUser) => {
    const userEntity = createUserEntity(instance.config.teamId, user);
    if (!userEntity) {
      return;
    }
    await jobState.addEntity(userEntity);
    await jobState.addRelationship(
      createTeamHasUserRelationship({
        teamId: instance.config.teamId,
        userEntity,
      }),
    );
  });
}

export const userSteps: IntegrationStep<SlackIntegrationConfig>[] = [
  {
    id: Steps.FETCH_USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.TEAM_HAS_USER],
    dependsOn: [Steps.FETCH_TEAM],
    ingestionSourceId: IngestionSources.USERS,
    executionHandler: fetchUsers,
  },
];
