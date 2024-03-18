# Get Cohort All (Search)

**URL** : `{host}/api/v1/cohort?groupNumber=&className=&specialty=`

**<span style="color:green;"> :) If No Parameter Specified will Get All The Cohorts</span>**

**URL Query Parameters** : 
- `groupNumber`
- `className` 
- `specialty`

**Method** : `GET`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "data": [
        {
            "id": 10,
            "groupeNumber": 1,
            "adminCreator": 1,
            "name": "1CS",
            "specialty": null
        },
        {
            "id": 11,
            "groupeNumber": 2,
            "adminCreator": 1,
            "name": "1CS",
            "specialty": null
        },
        {
            "id": 12,
            "groupeNumber": 3,
            "adminCreator": 1,
            "name": "1CS",
            "specialty": null
        },
        {
            "id": 13,
            "groupeNumber": 4,
            "adminCreator": 1,
            "name": "1CS",
            "specialty": null
        },
        {
            "id": 14,
            "groupeNumber": 5,
            "adminCreator": 1,
            "name": "1CS",
            "specialty": null
        },
        {
            "id": 15,
            "groupeNumber": 6,
            "adminCreator": 1,
            "name": "1CS",
            "specialty": null
        },
        {
            "id": 32,
            "groupeNumber": 7,
            "adminCreator": 1,
            "name": "1CS",
            "specialty": null
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
