# Get Users All (Search)

**URL** : `{host}/api/v1/users?name=&email=&role=`

**<span style="color:green;"> :) If No Parameter Specified will Get All The Users</span>**

**URL Query Parameters** :

- `name`
- `email`
- `role`

**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "data": [
        {
            "id": 1,
            "fullName": "zeddoun Lokmane",
            "password": "$2b$12$uxw1uvT8CBGqEMKNE1s9c.5drr6fDYjK9.dLKGQw4Sl59hC.eIrIi",
            "email": "l.zeddoun@esi-sba.dz",
            "isVerified": 0,
            "adminCreator": 1,
            "idGroupe": null,
            "color": "blue",
            "role": "student"
        },
        {
            "id": 1,
            "fullName": "Zeddoun Teacher ",
            "password": "$2b$12$urXhK2.5J1Jm.nRGxUhwHuehipQP43MS/9EXBxPZ8XEmGdRcHZVna",
            "isVerified": 1,
            "email": "zeddoun.lokmane@gmail.com",
            "adminCreator": 1,
            "color": "brown",
            "role": "teacher"
        },
        {
            "id": 3,
            "fullName": "Zeddoun Teacher ",
            "password": "$2b$12$ED2Ac2rL9uD19laNckg8OeQyKsIb1IBuuhP0CHaVdnSuvKdSp/via",
            "isVerified": 0,
            "email": "l.zeddoun@esi-sba.dz",
            "adminCreator": 1,
            "color": "brown",
            "role": "teacher"
        }
    ],
}
```

**Condition** : If No result.
**Code** : `200 OK`

```json
{
    "status": "failed",
    "err": {
        "statusCode": 400,
        "status": "failed",
        "isOperational": true
    },
    "message": "No User Found With This Email Or name",
    "stack": "Error: No User Found With This Email Or name\n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/userControllers.js:38:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```
