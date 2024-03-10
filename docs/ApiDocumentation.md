# REST API Docs (E-Learn)

[Postman Documentation](https://documenter.getpostman.com/view/25071654/2sA2xh3DGn)

## Open Endpoints

Open endpoints require no Authentication.

- [sign-In](./authentification/signIn.md) : `POST {host}/api/v1/auth/signIn/`

- [Email-verify-Link](./authentification/verify.md) : `GET {host}/api/v1/auth/:userId/verify/:token`
- [Resend Email](./authentification/resend.md) : `POST {host}/api/v1/auth/resend-email`
- [Forget-Password](./authentification/forget-password.md) : `POST {host}/api/v1/auth/forgot-password`
- [reset-Password](./authentification/reset-password.md) : `POST {host}/api/v1/auth/forgot-password`
- [logOut](./authentification/logOut.md) : `POST {host}/api/v1/auth/reset-password/:token`
 

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### Current User related
