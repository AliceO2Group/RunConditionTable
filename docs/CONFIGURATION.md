# Configuration
The following configuration items can be set using environment variables, note that Docker users can make use of the `env_file` file to store the configuration.

| Variable name | Description | Default value |
|---------------|-------------|---------------|
| RCT_HTTP_PORT | Port on which application works | |

## OpenID
| Variable name | Description | Default value |
|---------------|-------------|---------------|
| OPENID_ID | Application ID | |
| OPENID_SECRET | Application secret | |
| OPENID_REDIRECT | Authentication callback | |

## JSON Web Token (JWT)
| Variable name | Description | Default value |
|---------------|-------------|---------------|
| JWT_SECRET | Secret passphrase to sign and verify tokens. | |
| JWT_EXPIRATION | Token expiration time as time literal. | |

## Database
| Variable name | Description | Default value |
|---------------|-------------|---------------|
| DATABASE_HOST | The host of the relational database. | database |
| DATABASE_NAME | The name of the database | rct-db |
| DATABASE_USERNAME | The username which is used to authenticate against the database. |  |
| DATABASE_PASSWORD | The password which is used to authenticate against the database. |  |

## Misc.
| Variable name | Description | Default value |
|---------------|-------------|---------------|
| ALIMONITOR_PASSPHRASE | passphrase to the grid certificate (`rct-alimonitor-cert.p12`) | |
| CERN_SOCKS | address of proxy socket used for reaching CERN network | false |
