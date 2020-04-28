export function matchesSlackChannelUserRelationshipKey(): string {
  return expect.stringMatching(
    /slack-channel:team_(.*[a-zA-Z0-9]):channel_(.*[a-zA-Z0-9])\|has\|slack-user:team_(.*[a-zA-Z0-9]):user_(.*[a-zA-Z0-9])/g,
  );
}

export function matchesSlackChannelKey(): string {
  return expect.stringMatching(
    /slack-channel:team_(.*[a-zA-Z0-9]):channel_(.*[a-zA-Z0-9])/g,
  );
}

export function matchesSlackUserKey(): string {
  return expect.stringMatching(
    /slack-user:team_(.*[a-zA-Z0-9]):user_(.*[a-zA-Z0-9])/g,
  );
}
