# Insert New Student API

API endpoint to insert a new student.

## Endpoint

`POST /api/v1/admin/insert-new-student`

## Authentication

Requires admin access token.

## Request Body

- `fullName` (string, required): Full name of the student.
- `email` (string, required): Email address of the student.
- `password` (string, required): Password of the student.
- `idClass` (string, required): ID of the class the student belongs to.
- `groupeNumber` (string, required): Group number of the student.

## Response

- **Success Response**: 
  - **Code:** 200 OK
  - **Content:** `{ "message": "Student inserted successfully" }`
  
- **Error Response**:
  - **Code:** 400 Bad Request
    - **Content:** `{ "error": "Validation error: <error_message>" }`
  - **Code:** 404 Not Found
    - **Content:** `{ "error": "Cohort not found for the given class and group number" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "error": "Internal server error" }`

## Sample Request

```http
POST /api/v1/admin/insert-new-student
Content-Type: application/json

{
  "fullName": "hamdani ibrahim",
  "email": "i.hamdani@gmail.com",
  "password": "password123",
  "idClass": "3",
  "groupeNumber": "3"
}
