# Delete Student by ID API

API endpoint to delete a student by their ID.

## Endpoint

`DELETE /api/v1/admin/delete-student/:id`

## Authentication

Requires admin access token.

## Path Parameters

- `id`: The ID of the student to be deleted.

## Request Body

No request body is required.

## Response

- **Success Response**: 
  - **Code:** 200 OK
  - **Content:** `{ "message": "Student removed successfully" }`
  
- **Error Response**:
  - **Code:** 404 Not Found
    - **Content:** `{ "error": "Student not found" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "error": "An internal server error occurred" }`

## Sample Request

```http
DELETE /api/v1/admin/delete-student/123
