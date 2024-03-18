# Get Module All (Search)

**URL** : `{host}/api/v1/module?name=&className=&specialty=&semester&editor`

**<span style="color:green;"> :) If No Parameter Specified will Get All The Modules</span>**

**URL Query Parameters** :

- `name`
- `className`
- `specialty`
- `semester`
- `editor`

**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
	"data": [
		{
			"id": 25,
			"name": "Electronique  2",
			"semester": "S1",
			"description": "Etude Des diodes et ampliphicateur",
			"idEditor": 14
		},
		{
			"id": 27,
			"name": "Advanced Database",
			"semester": "S1",
			"description": "base de donnes avance",
			"idEditor": 4
		},
		{
			"id": 30,
			"name": "Reseaux",
			"semester": "S1",
			"description": "module de azza",
			"idEditor": 8
		}
	]
}
```

**Condition** : If No result.
**Code** : `200 OK`

```json
{
	"data": []
}
```
