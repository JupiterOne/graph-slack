import {
  Entity,
  Relationship,
  RelationshipClass,
  createDirectRelationship,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { SlackUser } from '../../provider/types';
import { Entities } from '../../constants';
import { toTeamEntityKey } from '../team/converter';

export function toUserEntityKey({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}): string {
  return `slack-user:team_${teamId}:user_${userId}`;
}

export function createUserEntity(
  teamId: string,
  user: SlackUser,
): Entity | undefined {
  if (!user.id) {
    return;
  }

  let userType = 'user';
  /* istanbul ignore next */
  if (user.is_owner === true) {
    userType = 'owner';
  } else if (user.is_admin === true) {
    userType = 'admin';
  } else if (user.is_bot) {
    userType = 'bot';
  } else if (user.is_app_user) {
    userType = 'app';
  }

  const emailDomain = user.profile?.email?.split('@').pop();

  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: toUserEntityKey({ teamId, userId: user.id }),
        _type: Entities.USER._type,
        _class: Entities.USER._class,

        // Normalize property names to match data model

        // NOTE: Slack _does not_ recommend the use of `user.name` and has moved
        // away from the concept of "usernames" to "display names".
        userId: user.id,
        username: user.name,
        realName: user.real_name,
        displayName:
          /* istanbul ignore next */
          (!!user.profile?.display_name && user.profile.display_name) ||
          (!!user.real_name && user.real_name) ||
          (!!user.name && user.name) ||
          user.id,
        email: user.profile?.email,
        emailDomain: emailDomain && [emailDomain],
        bot: user.is_bot === true,
        appUser: user.is_app_user === true,
        mfaEnabled:
          user.has_2fa != undefined ? user.has_2fa === true : undefined,
        admin: user.is_admin === true || user.is_owner === true,
        teamAdmin: user.is_admin === true,
        teamOwner: user.is_owner === true,
        primaryTeamOwner: user.is_primary_owner === true,
        restricted: user.is_restricted === true,
        ultraRestricted: user.is_ultra_restricted === true,
        active: user.deleted !== true,
        updatedOn: user.updated,
        userType,
      },
    },
  });
}

export function createTeamHasUserRelationship({
  teamId,
  userEntity,
}: {
  teamId: string;
  userEntity: Entity;
}): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    fromType: Entities.TEAM._type,
    fromKey: toTeamEntityKey(teamId),
    toType: Entities.USER._type,
    toKey: userEntity._key,
  });
}
