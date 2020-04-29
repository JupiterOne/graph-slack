# Development

This integration uses the [Slack API](https://api.slack.com/apis) for collecting
data.

## Prerequisites

Aside from what is documented in the [README](../README.md), no special tooling
is required to run and test this integration.

## Provider account setup

### Slack App

To obtain an access token for development, you will need to set up a Slack app.
You can find instructions on how to create a Slack app here:

[https://api.slack.com/tutorials/slack-apps-and-postman](https://api.slack.com/tutorials/slack-apps-and-postman)

For additional documentation on how the Slack OAuth flow works, please see:

[https://api.slack.com/legacy/oauth#flow](https://api.slack.com/legacy/oauth#flow)

## Authentication

Once you have finished setting up a Slack app and have obtained a Slack access
token, team ID, and have assigned relevant
[OAuth scopes](https://api.slack.com/legacy/oauth-scopes), you're now ready to
authenticate.

1. Create a `.env` file at the root of this project
1. Copy the access token you've created into the `.env` file at the root of this
   project, and set an `ACCESS_TOKEN` environment variable with the copied
   value.
1. Copy the team ID you've created into the `.env` file at the root of this
   project, and set an `TEAM_ID` environment variable with the copied value.
1. Copy the OAuth scopes you've assigned into the `.env` file at the root of
   this project, and set an `SCOPES` environment variable with the copied value.
   (_NOTE: These should be comma delimited!_)

```bash
ACCESS_TOKEN="paste the api key here"
TEAM_ID="abc123"
SCOPES="users:read,users:read.email,channels:read"
```

After following the above steps, you should be able to now invoke the
integration to start collecting data.
