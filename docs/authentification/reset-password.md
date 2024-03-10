# Reset Password

**URL** : `/api/v1/auth/reset-password/:token`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
	"newPassword": "[Valid Password]"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
	"message": "Password updated successfully"
}
```

## Error Response

**Condition** : Invalid Token .

**Code** : `401 BAD REQUEST`

**Content** :

```json
{
	"status": "failed",
	"err": {
		"statusCode": 400,
		"status": "failed",
		"isOperational": true
	},
	"message": "Invalid Token",
	"stack": "Error: Invalid Token\n    at /home/lokmane-zed/Desktop/E-Learn/E-Learn-Platform/back-end/controllers/authController.js:326:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
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
            "value": "z23",
            "msg": "Too short Password",
            "path": "newPassword",
            "location": "body"
        }
    ]
}

```