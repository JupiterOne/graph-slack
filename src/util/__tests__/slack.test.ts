import { parseSlackScopes } from '../slack';
import { USERS_READ_SCOPE, CHANNELS_READ_SCOPE } from '../../provider';

test('should parse slack scopes', () => {
  expect(parseSlackScopes(USERS_READ_SCOPE)).toEqual([USERS_READ_SCOPE]);
  expect(
    parseSlackScopes(`${USERS_READ_SCOPE},${CHANNELS_READ_SCOPE}`),
  ).toEqual([USERS_READ_SCOPE, CHANNELS_READ_SCOPE]);
  expect(
    parseSlackScopes(`  ${USERS_READ_SCOPE},${CHANNELS_READ_SCOPE}  `),
  ).toEqual([USERS_READ_SCOPE, CHANNELS_READ_SCOPE]);
});
