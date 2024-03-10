# Verify User Via Link To Email



**URL** : `/api/v1/auth/:userId/verify/:token`

**Method** : `GET`

![Email Verification Example](email_verification.png)
**Auth required** : NO



## Success Response

**Code** : `200 OK`

**Content example**

```json
{

      "message": "Your account verified",
      "userData": {
            "id": 2,
            "fullName": "lokmane-teacher",
            "password": "$2b$12$bBA2uFUMwAeiSZ5MxxnKzuUQ8PZwgtWS7lteBrdleYEQ2FTImd40y",
            "email": "zeddoun.lokmane@gmail.com",
            "adminCreator": 1,
            "color": "purple",
            "isVerified": true
      },
      "role": "teacher"

}
```

## Error Response

**Condition** : If Link have Expired Or not Valid .

**Code** : `401 BAD REQUEST`

**Content** :

```json
{

      "status": "Error",
      "err": {
            "statusCode": 401,
            "status": "Error",
            "isOperational": true
      },
      "message": "Invalid Link",
      "stack": "Error: Invalid Link\n    at /home/lokmane-zed/Desktop/E-Learn/E-Learn-Platform/back-end/controllers/authController.js:131:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"

}
```