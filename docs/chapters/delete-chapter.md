# Delete Chapter

- **Description**: This endpoint is used to delete a chapter.
- **Route**: `/api/v1/teacher/chapter/:chapterId`
- **Method**: DELETE
- **Access**: Teacher

## Path Parameters

| Parameter | Type   | Description                  |
|-----------|--------|------------------------------|
| chapterId | string | ID of the chapter to delete  |

## Response

- **Status Code**: 203 Non-Authoritative Information
- **Body**:

```json
{
    "message": "Chapter deleted"
}
