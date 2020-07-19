import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';
import getStepStartStates from './getStepStartStates';
import teamStep from './steps/team';
import fetchUsersStep from './steps/fetch-users';
import fetchChannelMembersStep from './steps/fetch-channel-members';
import fetchChannels from './steps/fetch-channels';
import { SlackIntegrationConfig } from './type';

export const invocationConfig: IntegrationInvocationConfig<SlackIntegrationConfig> = {
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
