import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessToken: {
    type: 'string',
    mask: true,
  },
  teamId: {
    type: 'string',
  },
  scopes: {
    type: 'string',
  },
};

export default instanceConfigFields;
