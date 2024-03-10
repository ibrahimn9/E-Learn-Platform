# Resend Email Verification To user

**URL** : `/api/v1/auth/resend-email`

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
    "message": "Email Verification Was sent To user"
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
    "message": "Invalid email",
    "stack": "Error: Invalid email\n    at /home/lokmane-zed/Desktop/E-Learn/E-Learn-Platform/back-end/controllers/authController.js:387:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
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