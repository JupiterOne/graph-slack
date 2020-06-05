import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';
import getStepStartStates from './getStepStartStates';
import fetchUsersStep from './steps/fetch-users';
import fetchChannelsWithUsersStep from './steps/fetch-channels-with-users';
import fetchChannels from './steps/fetch-channels';
import { SlackIntegrationConfig } from './type';

export const invocationConfig: IntegrationInvocationConfig<SlackIntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  getStepStartStates,
  integrationSteps: [fetchUsersStep, fetchChannelsWithUsersStep, fetchChannels],
};
