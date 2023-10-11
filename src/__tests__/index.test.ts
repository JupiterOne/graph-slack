import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { invocationConfig } from '../index';
import instanceConfigFields from '../instanceConfigFields';
import validateInvocation from '../validateInvocation';
import getStepStartStates from '../getStepStartStates';
import { SlackIntegrationConfig } from '../type';
import { teamSteps } from '../steps/team';
import { userSteps } from '../steps/fetch-users';
import { channelSteps } from '../steps/fetch-channels';
import { ingestionConfig } from '../ingestionConfig';

test('should export integration invocation config', () => {
  const expectedInvocationConfig: IntegrationInvocationConfig<SlackIntegrationConfig> =
    {
      instanceConfigFields,
      validateInvocation,
      getStepStartStates,
      ingestionConfig,
      integrationSteps: [...teamSteps, ...channelSteps, ...userSteps],
    };

  expect(invocationConfig).toEqual(expectedInvocationConfig);
});
