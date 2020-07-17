import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessToken: {
    type: 'string',
    mask: true,
  },
  teamId: {
    type: 'string',
  },
  teamName: {
    type: 'string',
  },
  scopes: {
    type: 'string',
  },
  appId: {
    type: 'string',
  },
  botUserId: {
    type: 'string',
  },
  authedUserId: {
    type: 'string',
  },
};

export default instanceConfigFields;
