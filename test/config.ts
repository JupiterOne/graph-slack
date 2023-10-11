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
  appId: process.env.APP_ID || 'app_id',
  botUserId: process.env.BOT_USER_ID || 'bot_user_id',
  authedUserId: process.env.AUTHED_USER_ID || 'authed_user_id',
  accessToken: process.env.ACCESS_TOKEN || 'access_token',
  scopes: process.env.SCOPES || 'users:read,channels:read,users:read.email',
  teamId: process.env.TEAM_ID || 'team_id',
  teamName: process.env.TEAM_NAME || 'test',
};
