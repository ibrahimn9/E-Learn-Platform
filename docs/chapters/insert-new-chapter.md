# Insert New Chapter

- **Description**: This endpoint is used to insert a new chapter.
- **Route**: `/api/v1/teacher/chapter/insert-new-chapter/:moduleId`
- **Method**: POST
- **Access**: Teacher

## Request Body

| Field       | Type   | Description                  |
|-------------|--------|------------------------------|
| title       | string | Title of the chapter         |
| description | string | Description of the chapter   |

## Path Parameters

| Parameter | Type   | Description                  |
|-----------|--------|------------------------------|
| moduleId  | string | ID of the associated module  |

## Response

- **Status Code**: 201 Created
- **Body**:

```json
{
    "message": "Chapter inserted successfully"
}
