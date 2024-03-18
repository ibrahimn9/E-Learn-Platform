# Update Class(Specialty)

**URL** : `{host}/api/v1/class/:classId`

**URL Parameters** : `classId=[integer]` where `classId` is the ID of the Cohort on the server.

**Method** : `PUT`

**Auth required** : YES

**Permissions required** :

User Role Must be :

- Admin `AA`

**Data constraints**

```json
  {
      "specialty":["specialty name"]
  }
```

**Data example**

```json
{
    "specialty":"Cyber"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Specialty Updated"
}
```

## Error Response

**Condition** : If Database Throw Error.
**Code** : `400 Bad Request`
