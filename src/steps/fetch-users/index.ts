import { IntegrationStep } from '@jupiterone/integration-sdk-core';

import { createSlackClient } from '../../provider';
import { SlackUser } from '../../provider/types';
import { createUserEntity, SLACK_USER_TYPE } from '../../converters';
import { SlackIntegrationConfig } from '../../type';

const step: IntegrationStep<SlackIntegrationConfig> = {
  id: 'fetch-users',
  name: 'Fetch Users',
  types: [SLACK_USER_TYPE],
  async executionHandler(context) {
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
