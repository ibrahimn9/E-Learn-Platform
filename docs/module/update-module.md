# Update Module

**URL** : `{host}/api/v1/module/:moduleId`

**URL Parameters** : `moduleId=[integer]` where `moduleId` is the ID of the Cohort on the server.

**Method** : `PUT`

**Auth required** : YES

**Permissions required** :

User Role Must be :

- Admin `AA`

**Data constraints**

```json
{
	"name": ["String Value"],
	"semester": ["S1", "S2"],
	"description": ["text description"],
	"editor": ["email or name of teacher"],
	"teachers": ["array of ids of teacher"]
}
```

**Data example**

```json
{
	"name": "Advanced Database",
	"semester": "S1",
	"description": "base de donne avance",
	"editor": "ay.kadri@esi-sba.dz",
	"teachers": [1, 3, 4]
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
	"message": "Module Updated"
}
```

## Error Response

**Condition** : If Database Throw Error.
**Code** : `400 Bad Request`
