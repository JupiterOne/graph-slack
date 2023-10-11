import { Steps } from '../../../constants';
import { buildStepTestConfig } from '../../../../test/config';
import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

describe(Steps.FETCH_TEAM, () => {
  test('success', async () => {
    const stepConfig = buildStepTestConfig(Steps.FETCH_TEAM);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
