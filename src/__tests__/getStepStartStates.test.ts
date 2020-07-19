import getStepStartStates from '../getStepStartStates';
import { createMockStepExecutionContext } from '../../test/context';
import { USERS_READ_SCOPE, CHANNELS_READ_SCOPE } from '../provider';
import { StepStartStates } from '@jupiterone/integration-sdk-core';

function getDefaultStepStartStates(overrideStates?: {
  [key: string]: { [prop: string]: unknown };
}): StepStartStates {
  return {
    team: {
      disabled: false,
    },
    'fetch-channels': {
      disabled: true,
    },
    'fetch-channel-members': {
      disabled: true,
    },
    'fetch-users': {
      disabled: true,
    },
    ...overrideStates,
  };
}

test('should throw if "accessToken" not provided in execution config', () => {
  const context = createMockStepExecutionContext({
    partialInstanceConfig: { accessToken: undefined },
  });

  expect(() => getStepStartStates(context)).toThrowError(
    'Configuration option "accessToken" is missing on the integration instance config',
  );
});

test('should throw if "teamId" not provided in execution config', () => {
  const context = createMockStepExecutionContext({
    partialInstanceConfig: { teamId: undefined },
  });

  expect(() => getStepStartStates(context)).toThrowError(
    'Configuration option "teamId" is missing on the integration instance config',
  );
});

test('should throw if "scopes" not provided in execution config', () => {
  const context = createMockStepExecutionContext({
    partialInstanceConfig: { scopes: undefined },
  });

  delete context.instance.config.scopes;
  expect(() => getStepStartStates(context)).toThrowError(
    'Configuration option "scopes" is missing on the integration instance config',
  );
});

test('should include "fetch-users" step if correct correct scopes provided', () => {
  const context = createMockStepExecutionContext({
    partialInstanceConfig: { scopes: USERS_READ_SCOPE },
  });

  const expectedStepStartStates = getDefaultStepStartStates({
    'fetch-users': {
      disabled: false,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});

test('should include "fetch-channel-members" step if correct correct scopes provided', () => {
  const context = createMockStepExecutionContext({
    partialInstanceConfig: {
      scopes: `${USERS_READ_SCOPE},${CHANNELS_READ_SCOPE}`,
    },
  });

  const expectedStepStartStates = getDefaultStepStartStates({
    'fetch-channel-members': {
      disabled: false,
    },
    'fetch-channels': {
      disabled: false,
    },
    'fetch-users': {
      disabled: false,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});

test('should disable "fetch-channel-members" step if "fetch-users" scopes are not set', () => {
  const context = createMockStepExecutionContext({
    partialInstanceConfig: {
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
