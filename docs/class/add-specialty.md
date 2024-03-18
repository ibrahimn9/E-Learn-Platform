# Create Class(Specialty)

**URL** : `{host}/api/v1/class`

**Method** : `POST`

**Auth required** : YES

**Permissions required** :

User Role Must be :

* Admin `AA`

**Data constraints**

```json
{

	"className": ["Valid Class Name"],
	"specialty": ["Specialty Name"]
}
```

**Data example**

```json
{
    "className" : "2cs",
    "specialty":"Cyber Security"
}
```

## Success Response

**Code** : `200 OK`

**Content example** 

```json
{
    "message": "Specialty Added"
}
```

## Error Response

**Condition** : If combination class And specialty exist.
**Code** : `400 Bad Request`

```json
{
    "status": "failed",
    "err": {
        "statusCode": 400,
        "status": "failed",
        "isOperational": true
    },
    "message": "Duplicate entry error: The combination of name and specialty already exists In class",
    "stack": "Error: Duplicate entry error: The combination of name and specialty already exists In class\n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/classControllers.js:14:6\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```



**Validation Error** : .

**Code** : `400 BAD REQUEST`

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
            "value": "2cpi",
            "msg": "invalid class",
            "path": "className",
            "location": "body"
        }
    ]
}
```
