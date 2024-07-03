import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { createSlackClient } from './provider';
import { SlackIntegrationConfig } from './type';

export default async function validateInvocation(
  context: IntegrationExecutionContext<SlackIntegrationConfig>,
): Promise<void> {
  const { accessToken, teamId, scopes } = context.instance.config;

  if (!accessToken) {
    throw new IntegrationValidationError(
      'Configuration option {accessToken} is required.',
    );
  }

  if (!teamId) {
    throw new IntegrationValidationError(
      'Configuration option {teamId} is required.',
    );
  }

  if (!scopes) {
    throw new IntegrationValidationError(
      'Configuration option {scopes} is required.',
    );
  }

  const client = createSlackClient(context);
  await client.verifyAuthentication();
}
