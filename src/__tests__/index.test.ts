import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { invocationConfig } from '../index';
import instanceConfigFields from '../instanceConfigFields';
import validateInvocation from '../validateInvocation';
import getStepStartStates from '../getStepStartStates';
import teamStep from '../steps/team';
import fetchUsersStep from '../steps/fetch-users';
import fetchChannelMembersStep from '../steps/fetch-channel-members';
import fetchChannels from '../steps/fetch-channels';
import { SlackIntegrationConfig } from '../type';

test('should export integration invocation config', () => {
  const expectedInvocationConfig: IntegrationInvocationConfig<SlackIntegrationConfig> = {
    instanceConfigFields,
    validateInvocation,
    getStepStartStates,
    integrationSteps: [
      teamStep,
      fetchUsersStep,
      fetchChannelMembersStep,
      fetchChannels,
    ],
  };

  expect(invocationConfig).toEqual(expectedInvocationConfig);
});
