# REST API Docs (E-Learn)

[Postman Documentation](https://documenter.getpostman.com/view/25071654/2sA2xh3DGn)

## Open Endpoints

Open endpoints require no Authentication.

- [sign-In](signIn.md) : `POST {host}/api/v1/auth/signIn/`

- [Email-verify-Link](verify.md) : `GET {host}/api/v1/auth/:userId/verify/:token`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### Current User related
