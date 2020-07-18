import { v4 as uuid } from 'uuid';
import * as testing from '@jupiterone/integration-sdk-testing';
import { SlackIntegrationConfig } from '../src/type';
import { IntegrationExecutionContext } from '@jupiterone/integration-sdk-core';
import { MockIntegrationStepExecutionContext } from '@jupiterone/integration-sdk-testing';

export function getMockIntegrationInstanceConfig(
  partial?: Partial<SlackIntegrationConfig>,
): SlackIntegrationConfig {
  return {
    accessToken: uuid(),
    scopes: uuid(),
    teamId: uuid(),
    teamName: uuid(),
    appId: uuid(),
    botUserId: uuid(),
    authedUserId: uuid(),
    ...partial,
  };
}

export function createMockStepExecutionContext(
  options: {
    partialInstanceConfig?: Partial<SlackIntegrationConfig>;
  } = {},
): MockIntegrationStepExecutionContext<SlackIntegrationConfig> {
  return testing.createMockStepExecutionContext({
    instanceConfig: getMockIntegrationInstanceConfig(
      options.partialInstanceConfig,
    ),
  });
}

export function createMockExecutionContext(
  options: {
    partialInstanceConfig?: Partial<SlackIntegrationConfig>;
  } = {},
): IntegrationExecutionContext<SlackIntegrationConfig> {
  return testing.createMockExecutionContext({
    instanceConfig: getMockIntegrationInstanceConfig(
      options.partialInstanceConfig,
    ),
  });
}
