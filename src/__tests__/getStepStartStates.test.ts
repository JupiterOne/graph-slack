import getStepStartStates from '../getStepStartStates';
import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { USERS_READ_SCOPE, CHANNELS_READ_SCOPE } from '../provider';
import { v4 as uuid } from 'uuid';
import { SlackIntegrationConfig } from '../type';

function getDefaultStepStartStates(overrideStates?: {
  [key: string]: { [prop: string]: unknown };
}) {
  return {
    'fetch-channels': {
      disabled: true,
    },
    'fetch-channels-with-users': {
      disabled: true,
    },
    'fetch-users': {
      disabled: true,
    },
    ...overrideStates,
  };
}

const instanceConfig: SlackIntegrationConfig = {
  accessToken: 'slack-access-token',
  scopes: 'slack-scopes',
  teamId: 'slack-team-id',
};

test('should throw if "accessToken" not provided in execution config', () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>({
    instanceConfig: { ...instanceConfig },
  });
  delete context.instance.config.accessToken;
  expect(() => getStepStartStates(context)).toThrowError(
    'Configuration option "accessToken" is missing on the integration instance config',
  );
});

test('should throw if "teamId" not provided in execution config', () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>({
    instanceConfig: { ...instanceConfig },
  });
  delete context.instance.config.teamId;
  expect(() => getStepStartStates(context)).toThrowError(
    'Configuration option "teamId" is missing on the integration instance config',
  );
});

test('should throw if "scopes" not provided in execution config', () => {
  const context = createMockStepExecutionContext<SlackIntegrationConfig>({
    instanceConfig: { ...instanceConfig },
  });
  delete context.instance.config.scopes;
  expect(() => getStepStartStates(context)).toThrowError(
    'Configuration option "scopes" is missing on the integration instance config',
  );
});

test('should include "fetch-users" step if correct correct scopes provided', () => {
  const context = createMockStepExecutionContext({
    instanceConfig: {
      accessToken: uuid(),
      teamId: uuid(),
      scopes: USERS_READ_SCOPE,
    },
  });

  const expectedStepStartStates = getDefaultStepStartStates({
    'fetch-users': {
      disabled: false,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});

test('should include "fetch-channels-with-users" step if correct correct scopes provided', () => {
  const context = createMockStepExecutionContext({
    instanceConfig: {
      accessToken: uuid(),
      teamId: uuid(),
      scopes: `${USERS_READ_SCOPE},${CHANNELS_READ_SCOPE}`,
    },
  });

  const expectedStepStartStates = getDefaultStepStartStates({
    'fetch-channels-with-users': {
      disabled: false,
    },
    'fetch-users': {
      disabled: false,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});

test('should disable "fetch-channels-with-users" step if "fetch-users" scopes are not set', () => {
  const context = createMockStepExecutionContext({
    instanceConfig: {
      accessToken: uuid(),
      teamId: uuid(),
      scopes: `${CHANNELS_READ_SCOPE}`,
    },
  });

  const expectedStepStartStates = getDefaultStepStartStates({
    'fetch-channels': {
      disabled: false,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});
