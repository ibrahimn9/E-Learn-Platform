# Get module By Id

**URL** : `{host}/api/v1/module/:moduleId`

**URL Parameters** : `moduleId=[integer]` where `moduleId` is the ID of the Cohort on the server.

**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "data": {
        "id": 30,
        "name": "Reseaux",
        "semester": "S1",
        "description": "module ",
        "idEditor": 8
    }
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
	"message": "There is no result ",
	"stack": "Error: There is no result \n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/cohorteController.js:39:15\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```