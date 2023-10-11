import { channelSteps } from './steps/fetch-channels';
import { userSteps } from './steps/fetch-users';
import { teamSteps } from './steps/team';

const integrationSteps = [...teamSteps, ...channelSteps, ...userSteps];

export { integrationSteps };
