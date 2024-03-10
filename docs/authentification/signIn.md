# Sign In


**URL** : `{host}/api/v1/auth/signIn/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
	"email": "[valid email address]",
	"password": "[password in plain text]"
}
```

**Data example**

```json
{
	"email": "l.zeddoun@esi-sba.dz",
	"password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Content example** [User Token Sent In Cookies]

```json
{
	"message": "Logged in successfully",
	"userData": {
		"id": 1,
		"fullName": "lokmane-student",
		"password": "$2b$12$YKdTgkrgLN7h30/h84v/..zGEgApu9v2tTtxANCtjjoYWpuAzSuzK",
		"email": "l.zeddoun@esi-sba.dz",
		"adminCreator": 2,
		"idGroupe": "25e4dd71-cfd4-4850-a584-07271f47cddc",
		"color": "yellow",
		"isVerified": 1
	},
	"role": "student"
}
```


**Condition** : If 'username' it's first time in our platform (isVerified = false).
**Code** : `200 OK`

```json
{
  "message": "Email Verification Was sent To user"
}
```
  ## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

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
	"message": "Invalid email or password",
	"stack": "Error: Invalid email or password\n    at /home/lokmane-zed/Desktop/E-Learn/E-Learn-Platform/back-end/controllers/authController.js:55:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```
**Condition** : If Already Email Sent.

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
    "message": "Email Already Sent",
    "stack": "Error: Email Already Sent\n    at /home/lokmane-zed/Desktop/E-Learn/E-Learn-Platform/back-end/controllers/authController.js:75:16\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```

**Validation Error** : .

**Code** : `401 BAD REQUEST`

**Content** :

```json
{
	"errors": [
		{
			"type": "[field]",
			"value": "[value]",
			"msg": "[Error Message]",
			"path": "[path]",
			"location": "[location]"
		}
	]
}
```

**Example** :

```json
{
	"errors": [
		{
			"type": "field",
			"value": "f",
			"msg": "Too short Password",
			"path": "password",
			"location": "body"
		}
	]
}
```
