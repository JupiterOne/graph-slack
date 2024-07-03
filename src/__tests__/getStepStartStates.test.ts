import { Steps } from '../constants';
import getStepStartStates from '../getStepStartStates';
import { CHANNELS_READ_SCOPE, USERS_READ_SCOPE } from '../provider';
import {
  DisabledStepReason,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';

function getDefaultStepStartStates(overrideStates?: {
  [key: string]: { [prop: string]: unknown };
}) {
  return {
    [Steps.FETCH_TEAM]: {
      disabled: false,
    },
    [Steps.FETCH_CHANNELS]: {
      disabled: true,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    [Steps.BUILD_CHANNEL_MEMBER_RELATIONSHIPS]: {
      disabled: true,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    [Steps.FETCH_USERS]: {
      disabled: true,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    ...overrideStates,
  } as StepStartStates;
}

test('should include "fetch-users" step if correct scopes provided', () => {
  const context = {
    instance: {
      config: {
        accessToken: 'access-token',
        teamId: 'team-id',
        scopes: `${USERS_READ_SCOPE}`,
      },
    },
  } as any;

  const expectedStepStartStates = getDefaultStepStartStates({
    [Steps.FETCH_USERS]: {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});

test('should include "fetch-channel-members" step if correct scopes provided', () => {
  const context = {
    instance: {
      config: {
        accessToken: 'access-token',
        teamId: 'team-id',
        scopes: `${USERS_READ_SCOPE},${CHANNELS_READ_SCOPE}`,
      },
    },
  } as any;

  const expectedStepStartStates = getDefaultStepStartStates({
    [Steps.BUILD_CHANNEL_MEMBER_RELATIONSHIPS]: {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    [Steps.FETCH_CHANNELS]: {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
    },
    [Steps.FETCH_USERS]: {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});

test('should disable "build-channel-member-relationships" step if "fetch-users" scopes are not set', () => {
  const context = {
    instance: {
      config: {
        accessToken: 'access-token',
        teamId: 'team-id',
        scopes: `${CHANNELS_READ_SCOPE}`,
      },
    },
  } as any;

  const expectedStepStartStates = getDefaultStepStartStates({
    [Steps.FETCH_CHANNELS]: {
      disabled: false,
      disabledReason: DisabledStepReason.PERMISSION,
    },
  });

  expect(getStepStartStates(context)).toEqual(expectedStepStartStates);
});
