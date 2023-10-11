import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { setupSlackRecording } from '../../../../test/recording';

import { Steps } from '../../../constants';
import { buildStepTestConfig } from '../../../../test/config';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe(Steps.FETCH_USERS, () => {
  test('success', async () => {
    recording = setupSlackRecording({
      directory: __dirname,
      name: Steps.FETCH_USERS,
    });

    const stepConfig = buildStepTestConfig(Steps.FETCH_USERS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
