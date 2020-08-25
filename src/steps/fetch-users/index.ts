import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createSlackClient } from '../../provider';
import { SlackUser } from '../../provider/types';
import {
  createUserEntity,
  SLACK_TEAM_TYPE,
  SLACK_USER_TYPE,
  createTeamHasUserRelationship,
  SLACK_TEAM_HAS_USER_RELATIONSHIP,
  SLACK_USER_CLASS,
} from '../../converters';
import { SlackIntegrationConfig } from '../../type';
import teamStep from '../team';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'fetch-users',
  name: 'Fetch Users',
  entities: [
    {
      resourceName: 'User',
      _type: SLACK_USER_TYPE,
      _class: SLACK_USER_CLASS,
    },
  ],
  relationships: [
    {
      _class: RelationshipClass.HAS,
      _type: SLACK_TEAM_HAS_USER_RELATIONSHIP,
      sourceType: SLACK_TEAM_TYPE,
      targetType: SLACK_USER_TYPE,
    },
  ],
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
