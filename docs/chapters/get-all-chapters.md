# Get All Chapters

- **Description**: This endpoint is used to retrieve all chapters associated with a module.
- **Route**: `/api/v1/teacher/chapter/:moduleId`
- **Method**: GET
- **Access**: Teacher

## Path Parameters

| Parameter | Type   | Description                  |
|-----------|--------|------------------------------|
| moduleId  | string | ID of the associated module  |

## Response

- **Status Code**: 200 OK
- **Body**: Array of chapter objects containing the following fields:
  - id: string (Chapter ID)
  - title: string (Title of the chapter)
  - description: string (Description of the chapter)
  - file: array (Array of documents associated with the chapter)

### Document Object

| Field       | Type   | Description                  |
|-------------|--------|------------------------------|
| id          | string | ID of the document           |
| title       | string | Title of the document        |
| url         | string | URL of the document          |

## Error Response

- **Status Code**: 404 Not Found
- **Body**:

```json
{
    "message": "Chapters not found"
}
