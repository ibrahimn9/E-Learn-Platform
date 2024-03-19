# Insert New Students API

API endpoint to insert new students from a CSV file.

## Endpoint

`POST /api/v1/admin/insert-new-students`

## Authentication

Requires admin access token.

## Request Parameters

- `file`: CSV file containing student data.

## Request Body

No additional parameters required.

## Response

- **Success Response**: 
  - **Code:** 200
  - **Content:** `{ "message": "Students inserted successfully" }`
  
- **Error Response**:
  - **Code:** 400 Bad Request
    - **Content:** `{ "error": "No file uploaded" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "error": "Internal server error" }`

## Sample Request

```http
POST /api/v1/admin/insert-new-students
Content-Type: multipart/form-data

[file]: <CSV file containing student data>


