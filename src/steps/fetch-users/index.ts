import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
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
    const client = createSlackClient(context);
    await client.iterateUsers((user: SlackUser) =>
      addSlackUserEntity(context, user),
    );
  },
};

export default step;

async function addSlackUserEntity(
  context: IntegrationStepExecutionContext<SlackIntegrationConfig>,
  user: SlackUser,
): Promise<void> {
  const { instance, jobState } = context;
  const userEntity = createUserEntity(instance.config.teamId, user);
  await jobState.addEntity(userEntity);
  await jobState.addRelationship(
    createTeamHasUserRelationship({
      teamId: instance.config.teamId,
      userEntity,
    }),
  );
}
