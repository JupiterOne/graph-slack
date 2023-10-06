/* eslint-disable @typescript-eslint/no-explicit-any */
// This is one of the few places where we want
// to allow for the 'any' type to be used.
//
// We are trying to avoid rewriting docs for providers.
//
// Read the docs to get the shape of the object.
// https://api.slack.com/apis
//
// There is still some value in having opaque types
// for converters to help ensure that the results from
// api calls are being routed to the correct converter.

import { ConversationsListResponse, UsersListResponse } from '@slack/web-api';

export type SlackUser = NonNullable<UsersListResponse['members']>[number];
export type SlackChannel = NonNullable<
  ConversationsListResponse['channels']
>[number];
