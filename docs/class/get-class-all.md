# Get Class All (Search)

**URL** : `{host}/api/v1/class?className=&specialty=`

**<span style="color:green;"> :) If No Parameter Specified will Get All The Classes</span>**

**URL Query Parameters** : 

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
            "id": 1,
            "name": "1CPI",
            "specialty": null
        },
        {
            "id": 3,
            "name": "1CS",
            "specialty": null
        },
        {
            "id": 2,
            "name": "2CPI",
            "specialty": null
        },
        {
            "id": 19,
            "name": "2CS",
            "specialty": "Cyber Security"
        },
        {
            "id": 9,
            "name": "2CS",
            "specialty": "IASD"
        },
        {
            "id": 7,
            "name": "2CS",
            "specialty": "ISI"
        },
        {
            "id": 6,
            "name": "2CS",
            "specialty": "SIW"
        },
        {
            "id": 13,
            "name": "3CS",
            "specialty": "IASD"
        },
        {
            "id": 11,
            "name": "3CS",
            "specialty": "ISI"
        },
        {
            "id": 12,
            "name": "3CS",
            "specialty": "SIW"
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
