import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { invocationConfig } from '../index';
import instanceConfigFields from '../instanceConfigFields';
import validateInvocation from '../validateInvocation';
import getStepStartStates from '../getStepStartStates';
import { SlackIntegrationConfig } from '../type';
import { teamSteps } from '../steps/team';
import { userSteps } from '../steps/fetch-users';
import { channelSteps } from '../steps/fetch-channels';

test('should export integration invocation config', () => {
  const expectedInvocationConfig: IntegrationInvocationConfig<SlackIntegrationConfig> =
    {
      instanceConfigFields,
      validateInvocation,
      getStepStartStates,
      integrationSteps: [...teamSteps, ...channelSteps, ...userSteps],
    };

  expect(invocationConfig).toEqual(expectedInvocationConfig);
});
