# Upload Mooc

**URL** : `{host}/api/v1/moocs/upload`

**Method** : `POST`

**Auth required** : YES

**Permissions required** :

User Role Must be :

* Teacher Has The Module IdEditor `AA`

**Data constraints**
##### FormData
| Key              | Type | Value                    |
| ---------------- | ---- | ------------------------ |
| mooc             | File | The video File To Upload |
| videoTitle       | Text | Video Title              |
| videoDescription | Text | Video Description        |
| idModule         | Text | Module Id                |


**Data example**

| Key              | Type | Value             |
| ---------------- | ---- | ----------------- |
| mooc             | File | video.mp4         |
| videoTitle       | Text | chapter 02 Algorithm  |
| videoDescription | Text | This Chapter is all about Array And Method To use with arrays |
| idModule         | Text | 41         |

## Success Response

**Code** : `200 OK`

**Content example** 

```json
{
    "data": {
        "msg": "OK",
        "status": 200,
        "files": [
            {
                "filecode": "sponmz27ipxr",
                "filename": "27-debugging-and-inspecting-event-listeners-with-browser-developer-tools-6FzEnrwI0.mp4",
                "status": "OK"
            }
        ]
    }
}
```

## Error Response

**Condition** : The name of module is unique and also the editor (if exist can't create )
**Code** : `400 Bad Request`

```json
{
{
    "status": "Error",
    "err": {
        "statusCode": 500,
        "status": "Error",
        "isOperational": true
    },
    "message": "The Upload Can't Finish Your Internet Isn't Working",
    "stack": "Error: The Upload Can't Finish Internal Error\n    at FfmpegCommand.<anonymous> (/home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/moocsControllers.js:81:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```



**Validation Error** : .

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "status": "failed",
    "err": {
        "statusCode": 400,
        "status": "failed",
        "isOperational": true
    },
    "message": "Video Title Or Description Is missed ",
    "stack": "Error: Video Title Or Description Is missed \n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/moocsControllers.js:44:7\n    at done (/home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/node_modules/multer/lib/make-middleware.js:45:7)\n    at indicateDone (/home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/node_modules/multer/lib/make-middleware.js:49:68)\n    at Multipart.<anonymous> (/home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/node_modules/multer/lib/make-middleware.js:166:7)\n    at Multipart.emit (node:events:514:28)\n    at emitCloseNT (node:internal/streams/destroy:132:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:81:21)"
}
```
**Validation Error** : .

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "status": "failed",
    "err": {
        "statusCode": 403,
        "status": "failed",
        "isOperational": true
    },
    "message": "You Aren't Allowed To perform This Action ",
    "stack": "Error: You Aren't Allowed To perform This Action \n    at /home/lokmane-zed/Home/E-Learn/E-Learn-Platform/back-end/controllers/moocsControllers.js:45:7\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}
```
