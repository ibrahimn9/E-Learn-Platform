# Insert New Teacher API

API endpoint to insert a new teacher.

## Endpoint

`POST /api/v1/admin/insert-new-teacher`

## Authentication

Requires admin access token.

## Request Body

- `fullName` (string, required): Full name of the teacher.
- `email` (string, required): Email address of the teacher.
- `password` (string, required): Password of the teacher.

## Response

- **Success Response**: 
  - **Code:** 201 Created
  - **Content:** `{ "message": "Teacher inserted successfully" }`
  
- **Error Response**:
  - **Code:** 400 Bad Request
    - **Content:** `{ "error": "Validation error: <error_message>" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "error": "Internal server error" }`

## Sample Request

```http
POST /api/v1/admin/insert-new-teacher
Content-Type: application/json

{
  "fullName": "abdelkader amrane",
  "email": "a.amrane@esi-sba.dz",
  "password": "password123"
}
