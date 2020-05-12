import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk';
import { invocationConfig } from '../index';
import instanceConfigFields from '../instanceConfigFields';
import validateInvocation from '../validateInvocation';
import getStepStartStates from '../getStepStartStates';
import fetchUsersStep from '../steps/fetch-users';
import fetchChannelsWithUsersStep from '../steps/fetch-channels-with-users';
import fetchChannels from '../steps/fetch-channels';

test('should export integration invocation config', () => {
  const expectedInvocationConfig: IntegrationInvocationConfig = {
    instanceConfigFields,
    validateInvocation,
    getStepStartStates,
    integrationSteps: [
      fetchUsersStep,
      fetchChannelsWithUsersStep,
      fetchChannels,
    ],
  };

  expect(invocationConfig).toEqual(expectedInvocationConfig);
});
