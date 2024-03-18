# Create Cohort

**URL** : `{host}/api/v1/cohort`

**Method** : `POST`

**Auth required** : YES

**Permissions required** :

User Role Must be :

* Admin `AA`

**Data constraints**

```json
{
	"groupNumber": ["Numeric Value"],
	"teachers": ["Array Of Ids Of Teacher "],
	"className": ["Valid Class Name"],
	"specialty": ["Specialty If the class Have"]
}
```

**Data example**

```json
{
    "groupNumber": 1 ,
    "teachers":[35, 4, 53, 21, 46, 49, 9, 27],
    "className":"2CS",
    "specialty":"ISI"
}
```

## Success Response

**Code** : `200 OK`

**Content example** 

```json
{
    "message": "Cohort Created"
}
```

## Error Response

**Condition** : If The combination of Class And group Already exist.
**Code** : `400 Bad Request`

```json
{
    "status": "failed",
    "err": {
        "statusCode": 400,
        "status": "failed",
        "isOperational": true
    },
    "message": "Duplicate entry error: The combination of idClass and groupeNumber already exists.",
    "stack": "Error: Duplicate entry error: The combination of idClass and groupeNumber already exists.\n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/cohorteController.js:70:5\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
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
            "msg": "Should be Teachers For this cohort",
            "path": "teachers",
            "location": "body"
        },
        {
            "type": "field",
            "msg": "teachers Should be array",
            "path": "teachers",
            "location": "body"
        },
        {
            "type": "field",
            "value": "valeu",
            "msg": "should be a numeric value",
            "path": "groupNumber",
            "location": "body"
        }
    ]
}
```
