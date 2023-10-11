import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';
import getStepStartStates from './getStepStartStates';
import { SlackIntegrationConfig } from './type';
import { integrationSteps } from './steps';
import { ingestionConfig } from './ingestionConfig';

export const invocationConfig: IntegrationInvocationConfig<SlackIntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    getStepStartStates,
    integrationSteps,
    ingestionConfig,
  };
