# Insert New Teachers API

API endpoint to insert new teachers from a CSV file.

## Endpoint

`POST /api/v1/admin/insert-new-teachers`

## Authentication

Requires admin access token.

## Request Parameters

- `file`: CSV file containing teacher data.

## Request Body

No additional parameters required.

## Response

- **Success Response**: 
  - **Code:** 201 Created
  - **Content:** `{ "message": "Teachers inserted successfully" }`
  
- **Error Response**:
  - **Code:** 400 Bad Request
    - **Content:** `{ "error": "No file uploaded" }`
  - **Code:** 500 Internal Server Error
    - **Content:** `{ "error": "Internal server error" }`

## Sample Request

```http
POST /api/v1/admin/insert-new-teachers
Content-Type: multipart/form-data

[file]: <CSV file containing teacher data>
