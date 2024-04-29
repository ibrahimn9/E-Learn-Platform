# Delete Document

- **Description**: This endpoint is used to delete a document.
- **Route**: `/api/v1/teacher/document/:documentId`
- **Method**: DELETE
- **Access**: Teacher

## Path Parameters

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| documentId| string | ID of the document to delete |

## Request Body

| Field | Type   | Description             |
|-------|--------|-------------------------|
| link  | string | Link to the document    |

## Response

- **Status Code**: 203 Non-Author
