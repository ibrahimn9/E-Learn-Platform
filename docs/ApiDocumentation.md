# REST API Docs (E-Learn)

[Postman Documentation](https://documenter.getpostman.com/view/25071654/2sA2xpS8w2#8b35954a-2fea-4f25-9b31-df8aeb4b53e0)

[Postman For Testing](https://www.postman.com/blue-satellite-18642/workspace/e-learn/collection/25071654-36ebbb4e-b159-4b0b-8a0b-fb8431be2b98?action=share&creator=25071654)

## Open Endpoints

Open endpoints require no Authentication.

- [sign-In](./authentification/signIn.md) : `POST {host}/api/v1/auth/signIn/`

- [Email-verify-Link](./authentification/verify.md) : `GET {host}/api/v1/auth/:userId/verify/:token`
- [Resend Email](./authentification/resend.md) : `POST {host}/api/v1/auth/resend-email`
- [Forget-Password](./authentification/forget-password.md) : `POST {host}/api/v1/auth/forgot-password`
- [reset-Password](./authentification/reset-password.md) : `POST {host}/api/v1/auth/reset-password/:token`
- [logOut](./authentification/logOut.md) : `POST {host}/api/v1/auth/logOut`
 

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the cookies of the
request. A Token can be acquired from the sign-In view above.

### Current Cohorte related

Each endpoint manipulates or displays information related to the Cohorte :
* [create-cohort](./cohort/create-cohort.md) : `POST {host}/api/v1/cohort`
* [delete-cohort](./cohort/delete-cohort.md) : `DELETE {host}/api/v1/cohort/:cohortId`
* [get-cohort-by-id](./cohort/get-cohort-by-id.md) : `GET {host}/api/v1/cohort/:cohortId`
* [get-cohort-all](./cohort/get-cohort-all.md) : `GET {host}/api/v1/cohort?groupNumber=&className=&specialty=`


### Current Module related

Each endpoint manipulates or displays information related to the Module :
* [create-module](./module/create-module.md) : `POST {host}/api/v1/module`
* [delete-module](./module/delete-module.md) : `DELETE {host}/api/v1/module/:moduleId`
* [get-module-by-id](./module/get-module-by-id.md) : `GET {host}/api/v1/module/:moduleId`
* [get-module-all](./module/get-module-all.md) : `GET {host}/api/v1/module?name=&className=&specialty=&semester&editor`
* [update-module](./module/update-module.md) : `GET {host}/api/v1/module/:moduleId`


### Current Class(Specialty) related

Each endpoint manipulates or displays information related to the Class(Specialty) :


* [add-specialty](./class/add-specialty.md) : `POST {host}/api/v1/class`
* [delete-specialty](./class/delete-specialty.md) : `DELETE {host}/api/v1/class/:classId`
* [get-class-by-id](./class/get-class-by-id.md) : `GET {host}/api/v1/class/:classId`
* [get-class-all](./class/get-class-all.md) : `GET {host}/api/v1/class?className=&specialty=`
* [update-specialty](./class/update-specialty.md) : `PUT {host}/api/v1/class/:classId`

### Current Users(Teacher-Student) related

Each endpoint manipulates or displays information related to the Users(Student - Teacher) :


* [get-user-by-id](./users/get-user-by-id.md) : `GET {host}/api/v1/users/:userId?role=`
* [get-user-all](./users/get-user-all.md) : `GET {host}/api/v1/users?name=&email=&role=`


### Current Moocs related

* [upload-mooc](./moocs/upload-mooc.md) : `POST {host}/api/v1/moocs/upload`
