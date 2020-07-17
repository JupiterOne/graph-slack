# Integration with JupiterOne

## Data Model

### Entities

The following entity resources are ingested when the integration runs:

| Resources | \_type of the Entity | \_class of the Entity |
| --------- | -------------------- | --------------------- |
| Account   | `slack_team`         | `Account`             |
| User      | `slack_user`         | `User`                |
| Channel   | `slack_channel`      | `Channel`             |

### Relationships

The following relationships are created/mapped:

| From            | Edge    | To           |
| --------------- | ------- | ------------ |
| `slack_team`    | **HAS** | `slack_user` |
| `slack_channel` | **HAS** | `slack_user` |
