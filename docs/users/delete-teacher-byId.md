# Delete Teacher by ID API

API endpoint to delete a teacher by their ID.

## Endpoint

`DELETE /api/v1/admin/delete-teacher/:id`

## Authentication

Requires admin access token.

## Path Parameters

- `id`: The ID of the teacher to be deleted.

## Request Body

No request body is required.

## Response

- **Success Response**: 
  - **Code:** 200 OK
  - **Content:** `{ "message": "Teacher removed successfully" }`
  
- **Error Response**:
  - **Code:** 404 Not Found
    - **Content:** `{ "error": "Teacher not found" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "error": "An internal server error occurred" }`

## Sample Request

```http
DELETE /api/v1/admin/delete-teacher/123
