# Delete Students by Class ID API

API endpoint to delete students belonging to a specific class by their class ID.

## Endpoint

`DELETE /api/v1/admin/delete-students/:id`

## Authentication

Requires admin access token.

## Path Parameters

- `id`: The ID of the class whose students are to be deleted.

## Request Body

No request body is required.

## Response

- **Success Response**: 
  - **Code:** 200 OK
  - **Content:** `{ "message": "Students removed successfully" }`
  
- **Error Response**:
  - **Code:** 404 Not Found
    - **Content:** `{ "error": "No students found for the given class ID" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "error": "An internal server error occurred" }`

## Sample Request

```http
DELETE /api/v1/admin/delete-students/123