import * as dotenv from 'dotenv';
import * as path from 'path';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import { invocationConfig } from '../src';
import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { SlackIntegrationConfig } from '../src/type';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

export function buildStepTestConfig(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: config,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}

export const config: SlackIntegrationConfig = {
  appId: process.env.APP_ID || '',
  botUserId: process.env.BOT_USER_ID || '',
  authedUserId: process.env.AUTHED_USER_ID || '',
  accessToken: process.env.ACCESS_TOKEN || '',
  scopes: process.env.SCOPES || '',
  teamId: process.env.TEAM_ID || '',
  teamName: process.env.TEAM_NAME || '',
};
