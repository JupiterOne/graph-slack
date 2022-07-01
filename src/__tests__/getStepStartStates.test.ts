import getStepStartStates from '../getStepStartStates';
import { createMockStepExecutionContext } from '../../test/context';
import { CHANNELS_READ_SCOPE, USERS_READ_SCOPE } from '../provider';
import {
  DisabledStepReason,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';

function getDefaultStepStartStates(overrideStates?: {
  [key: string]: { [prop: string]: unknown };
}): StepStartStates {
  return {
    team: {
      disabled: false,
    },
    'fetch-channels': {
      disabled: true,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    'fetch-channel-members': {
      disabled: true,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    'fetch-users': {
      disabled: true,
      disabledReason: DisabledStepReason.PERMISSION,
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

  // Latest version of TS do not allow deleting properties that are not optional
  delete (context as any).instance.config.scopes;
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
      disabledReason: DisabledStepReason.PERMISSION,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});

test('should include "fetch-channel-members" step if correct scopes provided', () => {
  const context = createMockStepExecutionContext({
    partialInstanceConfig: {
      scopes: `${USERS_READ_SCOPE},${CHANNELS_READ_SCOPE}`,
    },
  });

  const expectedStepStartStates = getDefaultStepStartStates({
    'fetch-channel-members': {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    'fetch-channels': {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    'fetch-users': {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
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
      disabledReason: DisabledStepReason.PERMISSION,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});
