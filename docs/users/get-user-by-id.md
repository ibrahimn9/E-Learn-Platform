# Get User By Id

**URL** : `{host}/api/v1/users/:userId?role=`

**URL Parameters** : `userId=[integer]` where `userId` is the ID of the User on the server.

**URL Query Parameters** :

- `role`
**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "data": {
        "id": 7,
        "fullName": "hakou Teacher",
        "password": "$2b$12$ZLCEARCOOvT72O933LEPdu2Pc0KSeMqVHMwpRu1MMmsWLErmkGufi",
        "isVerified": 1,
        "email": "h.djerad@esi-sba.dz",
        "adminCreator": 1,
        "color": null
    },
    "role": "teacher"
}
```

## Error Response

**Condition** : If Id Invalid.
**Code** : `400 Bad Request`

```json
{
    "status": "failed",
    "err": {
        "statusCode": 400,
        "status": "failed",
        "isOperational": true
    },
    "message": "No User Found With This Email Or name",
    "stack": "Error: No User Found With This Email Or name\n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/userControllers.js:75:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```
