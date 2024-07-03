import {
  DisabledStepReason,
  IntegrationExecutionContext,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { USERS_READ_SCOPE, CHANNELS_READ_SCOPE } from './provider';
import { parseSlackScopes } from './util/slack';
import { SlackIntegrationConfig } from './type';
import { Steps } from './constants';

export default function getStepStartStates(
  executionContext: IntegrationExecutionContext<SlackIntegrationConfig>,
): StepStartStates {
  const scopes = parseSlackScopes(executionContext.instance.config.scopes);

  return {
    [Steps.FETCH_TEAM]: { disabled: false },
    [Steps.FETCH_USERS]: {
      disabled: !scopes.has(USERS_READ_SCOPE),
      disabledReason: DisabledStepReason.PERMISSION,
    },
    [Steps.BUILD_CHANNEL_MEMBER_RELATIONSHIPS]: {
      disabled:
        !scopes.has(CHANNELS_READ_SCOPE) || !scopes.has(USERS_READ_SCOPE),
      disabledReason: DisabledStepReason.PERMISSION,
    },
    [Steps.FETCH_CHANNELS]: {
      disabled: !scopes.has(CHANNELS_READ_SCOPE),
      disabledReason: DisabledStepReason.PERMISSION,
    },
  };
}
