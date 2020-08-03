# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2.4.1 - 2020-08-03

- Fix typos in `jupiterone.md`

## 2.4.0 - 2020-08-03

- Update to latest integration SDK packages
- Documentation for installing the JupiterOne Slack app
- Documentation for configuring `SEND_SLACK_MESSAGE` rule action with a Slack
  integration instance configured

## 2.3.0 - 2020-07-19

- Fix [#2](https://github.com/JupiterOne/graph-slack/issues/2). Switch to using
  resource iteration approach when performing list all operations from Slack
  API, which reduces overall memory usage.

## 2.2.0 - 2020-07-18

- Create a `slack_team` entity and a relationship between each `slack_user` and
  the `slack_team`.

## 0.1.0 - 2020-04-27

### Added

- Collection of users and channels
