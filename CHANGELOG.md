# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 4.0.3 - 2022-01-28

### Changed

- The slack_user mfaEnabled property is now only set when we receive valid data
  for it from Slack.
- Documentation now notes that only Admin and higher users who install the
  JupiterOne Slack integration application will have access to some properties
  from Slack.

## 4.0.2 - 2022-01-28

Fixed GitHub build action to `yarn build` prior to publish.

## 4.0.1 - 2022-01-28

### Changed

- Upgrade slack/web-api to 6.6.0
- Fixed main and types in the packages.json

## 4.0.0 - 2021-11-08

### Changed

- Upgraded all npm packages
- Updated build config to only run on Node 14

## 3.10.0 - 2021-05-25

- Added `userType` property to `slack_user`. Possible values include: `user`,
  `admin`, `owner`, `bot`, `app`.

## 3.9.0 - 2021-05-25

- Fixed `bot` property on `slack_user`
- Added `appUser` property

## 3.8.0 - 2021-04-26

### Changed

- Upgraded all npm packages
- Removed unused npm packages
- Fix audits

## 3.7.0 - 2021-03-19

- Add `emailDomain` property to `slack_user`

## 3.6.0 - 2021-02-11

- Upgrade various npm packages

## 3.5.0 - 2021-02-05

- Changed `displayName` of `slack_user` to use `display_name` or `real_name` or
  `name`, fallback to `id` only when those are undefined.

- Changed `username` property to use value from `user.name` instead of
  `user.id`.

- Added `userId` property using value from `user.id`.

- Added `admin` boolean property to `slack_user`, as it is a normalized property
  on the `User` class entity.

- Added normalized boolean properties `active`, `archived`, `public`, `private`
  to the `slack_channel` entity.

## 3.4.1 - 2020-11-24

- Added retries for `slack_webapi_platform_error` error codes. The Slack Client
  includes retry configurations, but aside from 429s, the client does not retry
  any non-200 error codes. Some integrations have seen very intermittent non-429
  errors, but we don't actually know much about what is causing them. Retrying
  these errors should reduce our intermittent failures and log some insights as
  to what types of errors these represent.

## 3.4.0 - 2020-10-29

### Changed

- Upgrade SDK v4

## 3.3.0 - 2020-10-27

### Added

- Added `active` property to `slack_user`.

Example query to find all deactivated Slack users:

```
find slack_user with active != true
```

### Changed

- Updated docs to include note about private Slack channel message delivery

## 3.2.0 - 2020-10-27

### Changed

- Updated API `limit` settings

## 3.1.0 - 2020-10-23

### Changed

- Updated rate limit settings
- Additional logging around requests

## 3.0.0 - 2020-08-25

### Changed

- [#21](https://github.com/JupiterOne/graph-slack/issues/21) Update integration
  SDK to v3.0.0

## 2.4.1 - 2020-08-03

### Changed

- Fix typos in `jupiterone.md`

## 2.4.0 - 2020-08-03

### Added

- Documentation for installing the JupiterOne Slack app
- Documentation for configuring `SEND_SLACK_MESSAGE` rule action with a Slack
  integration instance configured

### Changed

- Update to latest integration SDK packages

## 2.3.0 - 2020-07-19

### Updated

- [#2](https://github.com/JupiterOne/graph-slack/issues/2). Switch to using
  resource iteration approach when performing list all operations from Slack
  API, which reduces overall memory usage.

## 2.2.0 - 2020-07-18

### Added

- Create a `slack_team` entity and a relationship between each `slack_user` and
  the `slack_team`.

## 0.1.0 - 2020-04-27

### Added

- Collection of users and channels
