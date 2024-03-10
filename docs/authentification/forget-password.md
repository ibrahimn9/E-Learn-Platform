# Forget Password

**URL** : `/api/v1/auth/forget-password`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
	"email": "[valid email address]"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Reset instructions sent to your email",
    "token": "888e4432ee12e89b80b0c0d1e29227b7b3b13136e625bb523a6d4099a9f23181"
}
```

## Error Response

**Condition** : Invalid Email .

**Code** : `401 BAD REQUEST`

**Content** :

```json
{
    "status": "failed",
    "err": {
        "statusCode": 401,
        "status": "failed",
        "isOperational": true
    },
    "message": "User not found",
    "stack": "Error: User not found\n    at /home/lokmane-zed/Desktop/E-Learn/E-Learn-Platform/back-end/controllers/authController.js:255:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```


**Condition** : Validation Problem .

**Code** : `400 BAD REQUEST`

**Content** :


```json

{
    "errors": [
        {
            "type": "field",
            "value": "lokmane",
            "msg": "Invalid Email",
            "path": "email",
            "location": "body"
        }
    ]
}

```