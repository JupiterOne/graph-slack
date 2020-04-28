import {
  IntegrationStepStartStates,
  IntegrationExecutionContext,
} from '@jupiterone/integration-sdk';
import { USERS_READ_SCOPE, CHANNELS_READ_SCOPE } from './provider';
import fetchUsersStep from './steps/fetch-users';
import fetchChannelsWithUsersStep from './steps/fetch-channels-with-users';
import fetchChannels from './steps/fetch-channels';
import { parseSlackScopes } from './util/slack';

function validateExecutionConfig(
  executionContext: IntegrationExecutionContext,
): void {
  const { accessToken, teamId, scopes } = executionContext.instance.config;

  if (!accessToken) {
    throw new Error(
      'Configuration option "accessToken" is missing on the integration instance config',
    );
  }

  if (!teamId) {
    throw new Error(
      'Configuration option "teamId" is missing on the integration instance config',
    );
  }

  if (!scopes) {
    throw new Error(
      'Configuration option "scopes" is missing on the integration instance config',
    );
  }
}

export default function getStepStartStates(
  executionContext: IntegrationExecutionContext,
): IntegrationStepStartStates {
  validateExecutionConfig(executionContext);

  const scopes = new Set(
    parseSlackScopes(executionContext.instance.config.scopes),
  );

  const fetchChannelsWithUsersDisabled =
    !scopes.has(CHANNELS_READ_SCOPE) || !scopes.has(USERS_READ_SCOPE);

  return {
    [fetchUsersStep.id]: { disabled: !scopes.has(USERS_READ_SCOPE) },
    [fetchChannelsWithUsersStep.id]: {
      disabled: fetchChannelsWithUsersDisabled,
    },
    [fetchChannels.id]: {
      disabled:
        // NOTE: This state only gets executed if we have permission to read
        // channels, but do not have permission to read users
        !scopes.has(CHANNELS_READ_SCOPE) || !fetchChannelsWithUsersDisabled,
    },
  };
}
