import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../../constants';

export function toTeamEntityKey(teamId: string): string {
  return `slack-team:${teamId}`;
}

export function createTeamEntity(teamData: {
  teamId: string;
  teamName: string;
  appId: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: teamData,
      assign: {
        _key: toTeamEntityKey(teamData.teamId),
        _type: Entities.TEAM._type,
        _class: Entities.TEAM._class,
        id: teamData.teamId,
        displayName: teamData.teamName,
        name: teamData.teamName,
        appId: teamData.appId,
      },
    },
  });
}
