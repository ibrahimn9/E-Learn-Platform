# Create Module

**URL** : `{host}/api/v1/module`

**Method** : `POST`

**Auth required** : YES

**Permissions required** :

User Role Must be :

* Admin `AA`

**Data constraints**

```json
{
    "name":["String Value"],
    "semester":["S1","S2"],
    "description" : ["text description"] ,
    "editor" : ["email or name of teacher"],
    "classes":["array of classes"],
    "teachers":["array of ids of teacher"]
}
```

**Data example**

```json
{
    "name":"Advanced Database",
    "semester":"S1",
    "description" : "base de donne avance" ,
    "editor" : "ay.kadri@esi-sba.dz",
    "classes":[["2CS","SIW"],["2CS","ISI"]],
    "teachers":[1,3,4]
}
```

## Success Response

**Code** : `200 OK`

**Content example** 

```json
{
    "message": "Module Created"
}
```

## Error Response

**Condition** : The name of module is unique and also the editor (if exist can't create )
**Code** : `400 Bad Request`

```json
{
    "status": "Error",
    "err": {
        "message": "Duplicate entry 'Advanced Database' for key 'modules.unique_module_name'",
        "code": "ER_DUP_ENTRY",
        "errno": 1062,
        "sql": "INSERT INTO modules (name, semester, description, idEditor ) VALUES (?,?,?,?) ",
        "sqlState": "23000",
        "sqlMessage": "Duplicate entry 'Advanced Database' for key 'modules.unique_module_name'",
        "statusCode": 500,
        "status": "Error"
    },
    "message": "Duplicate entry 'Advanced Database' for key 'modules.unique_module_name'",
    "stack": "Error: Duplicate entry 'Advanced Database' for key 'modules.unique_module_name'\n    at PromisePool.execute (/home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/node_modules/mysql2/promise.js:374:22)\n    at Module.save (/home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/model/module.model.js:11:13)\n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/moduleController.js:111:31\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
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
            "msg": "Module Name is required",
            "path": "name",
            "location": "body"
        },
        {
            "type": "field",
            "msg": "Should be a semester",
            "path": "semester",
            "location": "body"
        },
        {
            "type": "field",
            "msg": "Invalid semester",
            "path": "semester",
            "location": "body"
        }
    ]
}
```
