import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk';

import { createSlackClient } from '../../provider';
import { SlackUser } from '../../provider/types';
import { createUserEntity, SLACK_USER_TYPE } from '../../converters';

const step: IntegrationStep = {
  id: 'fetch-users',
  name: 'Fetch Users',
  types: [SLACK_USER_TYPE],
  async executionHandler(context: IntegrationStepExecutionContext) {
    const { instance, jobState } = context;
    const client = createSlackClient(context);

    const members = await client.listAllUsers();

    await jobState.addEntities(
      members.map((user: SlackUser) => {
        return createUserEntity(instance.config.teamId, user);
      }),
    );
  },
};

export default step;
