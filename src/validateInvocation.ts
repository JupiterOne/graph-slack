import { IntegrationExecutionContext } from '@jupiterone/integration-sdk';
import { createSlackClient } from './provider';

export default async function validateInvocation(
  context: IntegrationExecutionContext,
): Promise<void> {
  context.logger.info(
    {
      instance: context.instance,
    },
    'Validating integration config...',
  );

  if (await isConfigurationValid(context)) {
    context.logger.info('Integration instance is valid!');
  } else {
    throw new Error('Failed to authenticate with provided credentials');
  }
}

async function isConfigurationValid(
  context: IntegrationExecutionContext,
): Promise<boolean> {
  try {
    const client = createSlackClient(context);
    await client.api.test();
    return true;
  } catch (err) {
    context.logger.error({ err }, 'Error validating configuration');
    return false;
  }
}
