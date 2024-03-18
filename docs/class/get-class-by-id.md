# Get Class By Id

**URL** : `{host}/api/v1/class/:classId`

**URL Parameters** : `classId=[integer]` where `classId` is the ID of the Cohort on the server.

**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "data": {
        "id": 6,
        "name": "2CS",
        "specialty": "SIW"
    }
}
```

## Error Response

**Condition** : If Id Invalid.
**Code** : `200 ok`

```json
{}
```
