# Insert New Document

- **Description**: This endpoint is used to insert a new document into a chapter.
- **Route**: `/api/v1/teacher/document/insert-new-document/:chapterId`
- **Method**: POST
- **Access**: Teacher

## Request Body

| Field       | Type   | Description                  |
|-------------|--------|------------------------------|
| title       | string | Title of the document        |
| description | string | Description of the document  |
| type        | string | Type of the document         |
| file        | file   | File to be uploaded          |

## Path Parameters

| Parameter | Type   | Description                  |
|-----------|--------|------------------------------|
| chapterId | string | ID of the associated chapter |

## Response

- **Status Code**: 201 Created
- **Body**:

```json
{
    "message": "Document inserted successfully"
}
