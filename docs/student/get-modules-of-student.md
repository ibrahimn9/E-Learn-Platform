# Get All Modules of Student

- **Description**: This endpoint is used to retrieve all modules associated with a student's cohort.
- **Route**: `/api/v1/student/:cohortId`
- **Method**: GET
- **Access**: Student

## Path Parameters

| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| cohortId  | string | ID of the student's cohort |

## Response

- **Status Code**: 200 OK
- **Body**: Array of module objects containing the following fields:
  - id: string (Module ID)
  - name: string (Name of the module)
  - semester: integer (Semester of the module)
  - description: string (Description of the module)
  - chapters: array (Array of chapters associated with the module)

### Chapter Object

| Field       | Type   | Description                  |
|-------------|--------|------------------------------|
| id          | string | ID of the chapter            |
| title       | string | Title of the chapter         |
| description | string | Description of the chapter   |

## Error Response

- **Status Code**: 404 Not Found
- **Body**:

```json
{
    "message": "Modules not found"
}
