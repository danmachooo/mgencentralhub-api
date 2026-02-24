# API Documentation

This document reflects the currently mounted Express routes in this codebase (`src/app.ts` + `src/routes/**`) and the request/response contracts enforced in `src/features/**`.

## Base URL

- API base: `/api`
- Public health root: `/`

## Auth

- Routes under `/api/systems`, `/api/departments`, `/api/users`, and `/api/roles` require auth via `requireAuth` middleware.
- Authenticated routes expect a valid Better Auth session cookie.

## Common Response Envelopes

### Success (non-paginated)

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

### Success (paginated)

```json
{
  "success": true,
  "message": "string",
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false
  }
}
```

### Error (global error handler)

```json
{
  "success": false,
  "message": "string",
  "errors": []
}
```

`errors` is optional and appears for validation/domain errors.

## Reusable Request Shapes

### UUID path param

```json
{
  "id": "uuid"
}
```

### Base collection query

```json
{
  "page": 1,
  "limit": 10,
  "sortOrder": "asc | desc",
  "sortBy": "string (route-specific)",
  "search": "string (optional)"
}
```

## Public Routes

### `GET /`

- Request shape: none
- Response shape:

```json
{
  "success": true,
  "message": "I am running :))"
}
```

### `GET /api/health`

- Request shape: none
- Response shape:

```json
{
  "success": true,
  "message": "OK"
}
```

### `GET /api/health/error`

- Query shape:

```json
{
  "type": "app | zod | error | async"
}
```

- Response shape:
  - `400` when missing/invalid `type`:

```json
{
  "success": false,
  "message": "Missing/invalid type. Use ?type=app|zod|error|async"
}
```

  - Other values intentionally throw errors to exercise the global error handler.

## Auth Test Routes (`/api/auth-test`)

### `POST /api/auth-test/sign-up`

- Body shape:

```json
{
  "name": "string",
  "email": "valid email",
  "password": "string (min 1)",
  "roleId": "uuid",
  "departmentId": "uuid"
}
```

- Response shape (`201`):

```json
{
  "success": true,
  "message": "User has been registered."
}
```

### `POST /api/auth-test/sign-in`

- Body shape:

```json
{
  "email": "valid email",
  "password": "string (min 1)"
}
```

- Response shape (`200`):

```json
{
  "success": true,
  "message": "User is logged in..",
  "data": {}
}
```

`set-cookie` header may be appended when sign-in succeeds.

### `GET /api/auth-test/get-session`

- Request shape: none (uses request headers/cookies)
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Current Session has been retrieved",
  "session": {}
}
```

`session` may be `null` if no active session.

## Systems Routes (`/api/systems`) [Auth Required]

### System entity shape used in responses

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string | null",
  "systemFlag": {
    "id": "uuid",
    "name": "string",
    "description": "string"
  },
  "url": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "departmentMap": [
    {
      "departmentId": "uuid"
    }
  ]
}
```

### `GET /api/systems`

- Query shape:

```json
{
  "page": 1,
  "limit": 10,
  "sortOrder": "asc | desc",
  "sortBy": "createdAt | name",
  "search": "string (optional)",
  "status": "string (optional)"
}
```

- Response shape (`200`): paginated `System[]`

### `GET /api/systems/deleted`

- Route is mounted as `getDeletedCompanySystems` (service function) instead of an Express handler.
- Current runtime behavior is miswired and may not send a proper HTTP JSON response.

### `GET /api/systems/:id`

- Params shape: `{ "id": "uuid" }`
- Response shape (`200`):

```json
{
  "success": true,
  "message": "System has been retrieved.",
  "data": {
    "system": {}
  }
}
```

`data.system` follows the System entity shape above.

### `POST /api/systems`

- Body shape:

```json
{
  "name": "string",
  "description": "string",
  "image": "string",
  "url": "https URL",
  "statusId": "uuid",
  "departmentIds": ["uuid"]
}
```

- Response shape (`201`):

```json
{
  "success": true,
  "message": "System has been created.",
  "data": {
    "id": "uuid"
  }
}
```

### `POST /api/systems/:id/toggle-favorite`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Added to favorites. | Removed from favorites"
}
```

### `PATCH /api/systems/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape:

```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "image": "string (optional)",
  "url": "https URL (optional)",
  "statusId": "uuid (optional)",
  "departmentIds": ["uuid"]
}
```

- Response shape (`200`):

```json
{
  "success": true,
  "message": "System has been updated.",
  "data": {
    "id": {
      "id": "uuid",
      "updatedAt": "datetime"
    }
  }
}
```

### `PATCH /api/systems/:id/restore`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`200`):

```json
{
  "success": true,
  "message": "System has been restored.",
  "data": {
    "restoredSystem": {}
  }
}
```

`data.restoredSystem` follows the System entity shape.

### `DELETE /api/systems/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`404`):

```json
{
  "success": true,
  "message": "System has been deleted."
}
```

### `DELETE /api/systems/:id/hard`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`410`):

```json
{
  "success": true,
  "message": "System has been deleted."
}
```

### `GET /api/systems/favorites`

- Query shape: same as `GET /api/systems`
- Response shape (`200`): paginated list in `data`

### `GET /api/systems/personal`

- Query shape: same as `GET /api/systems` (`status` + base pagination query)
- Response shape (`200`): paginated `System[]`

### `GET /api/systems/personal/deleted`

- Route is mounted as `getDeletedCompanySystems` (service function) instead of an Express handler.
- Current runtime behavior is miswired and may not send a proper HTTP JSON response.

### `GET /api/systems/personal/:id`

- Params shape: `{ "id": "uuid" }`
- Response shape (`200`):

```json
{
  "success": true,
  "message": "System has been retrieved.",
  "data": {
    "system": {}
  }
}
```

### `POST /api/systems/personal`

- Body shape: same as `POST /api/systems`
- Response shape (`201`): same as `POST /api/systems`

### `PATCH /api/systems/personal/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape: same as `PATCH /api/systems/:id`
- Response shape (`200`): same shape as `PATCH /api/systems/:id`

### `PATCH /api/systems/personal/:id/restore`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`200`): same as `PATCH /api/systems/:id/restore`

### `DELETE /api/systems/personal/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`404`):

```json
{
  "success": true,
  "message": "System has been deleted."
}
```

### `DELETE /api/systems/personal/:id/hard`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`410`):

```json
{
  "success": true,
  "message": "System has been deleted."
}
```

### `GET /api/systems/personal/favorites`

- Query shape:

```json
{
  "page": 1,
  "limit": 10,
  "sortOrder": "asc | desc",
  "sortBy": "createdAt | name",
  "search": "string (optional)"
}
```

- Response shape (`200`): paginated list in `data`

### `POST /api/systems/personal/favorites/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Favorite System has been retrieved.",
  "data": {
    "favorite": {}
  }
}
```

### `POST /api/systems/personal/favorites/:id/toggle-favorite`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Added to favorites. | Removed from favorites"
}
```

## Departments Routes (`/api/departments`) [Auth Required]

### Department entity shape

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string | null",
  "createdAt": "datetime"
}
```

### `GET /api/departments`

- Query shape:

```json
{
  "page": 1,
  "limit": 10,
  "sortOrder": "asc | desc",
  "sortBy": "name | createdAt",
  "search": "string (optional)",
  "name": "string (optional)"
}
```

- Response shape (`200`): paginated `Department[]`

### `GET /api/departments/deleted`

- Query shape: same as `GET /api/departments`
- Response shape (`200`): paginated `Department[]`

### `GET /api/departments/:id`

- Params shape: `{ "id": "uuid" }`
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Department has been retrieved.",
  "data": {
    "department": {}
  }
}
```

### `POST /api/departments`

- Body shape:

```json
{
  "name": "string",
  "description": "string (optional)"
}
```

- Response shape (`201`):

```json
{
  "success": true,
  "message": "Department has been created.",
  "data": {
    "id": "uuid"
  }
}
```

### `POST /api/departments/bulk`

- Body shape:

```json
[
  {
    "name": "string",
    "description": "string (optional)"
  }
]
```

- Response shape (`201`):

```json
{
  "success": true,
  "message": "Department has been created.",
  "data": {
    "createdDepartments": [
      {
        "id": "uuid",
        "createdAt": "datetime"
      }
    ]
  }
}
```

### `PATCH /api/departments/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape:

```json
{
  "name": "string",
  "description": "string (optional)"
}
```

- Response shape (`200`):

```json
{
  "success": true,
  "message": "Department has been updated.",
  "data": {
    "id": "uuid"
  }
}
```

### `PATCH /api/departments/:id/restore`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`404`):

```json
{
  "success": true,
  "message": "Department has been deleted"
}
```

### `DELETE /api/departments/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`404`):

```json
{
  "success": true,
  "message": "Department has been deleted"
}
```

### `DELETE /api/departments/:id/hard`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`410`):

```json
{
  "success": true,
  "message": "Department has been deleted"
}
```

## Users Routes (`/api/users`) [Auth Required]

### User list item shape

```json
{
  "userId": "string",
  "createdAt": "datetime",
  "role": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "deletedAt": "datetime | null"
  },
  "department": {
    "name": "string"
  },
  "user": {
    "email": "string",
    "name": "string",
    "image": "string | null"
  }
}
```

### `GET /api/users`

- Query shape:

```json
{
  "page": 1,
  "limit": 10,
  "sortOrder": "asc | desc",
  "sortBy": "createdAt | role",
  "search": "string (optional)",
  "role": "string (optional)"
}
```

- Response shape (`200`): paginated list of user list items

## Roles Routes (`/api/roles`) [Auth Required]

### Role entity shape in list/detail responses

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "createdAt": "datetime"
}
```

### `GET /api/roles`

- Request shape: none
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Active roles has been retrieved.",
  "data": {
    "roles": [],
    "total": 0
  }
}
```

### `GET /api/roles/inactive`

- Request shape: none
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Inactive roles has been retrieved.",
  "data": {
    "roles": [],
    "total": 0
  }
}
```

### `GET /api/roles/:id`

- Params shape: `{ "id": "uuid" }`
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Active Role has been retrieved.",
  "data": {
    "role": {}
  }
}
```

### `POST /api/roles`

- Body shape:

```json
{
  "name": "string",
  "description": "string"
}
```

- Response shape (`201`):

```json
{
  "success": true,
  "message": "Role has been created.",
  "data": {
    "roleCreated": {}
  }
}
```

`roleCreated` is the created Prisma `Role` record (includes all scalar role columns).

### `POST /api/roles/many`

- Body shape:

```json
[
  {
    "name": "string",
    "description": "string"
  }
]
```

- Response shape (`200`):

```json
{
  "success": true,
  "message": "Roles has been created.",
  "data": {
    "rolesCreated": [
      {
        "id": "uuid"
      }
    ]
  }
}
```

### `PATCH /api/roles/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape:

```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```

- Response shape (`200`):

```json
{
  "success": true,
  "message": "Role has been updated.",
  "data": {
    "roleUpdated": {}
  }
}
```

`roleUpdated` is the updated Prisma `Role` record.

### `PATCH /api/roles/:id/restore`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`200`):

```json
{
  "success": true,
  "message": "Role has been restored.",
  "data": {
    "restoredRole": {}
  }
}
```

### `DELETE /api/roles/:id`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`404`):

```json
{
  "success": true,
  "message": "Role has been deleted."
}
```

### `DELETE /api/roles/:id/hard`

- Params shape: `{ "id": "uuid" }`
- Body shape: none
- Response shape (`410`):

```json
{
  "success": true,
  "message": "Role has been deleted."
}
```

## Not Mounted (Not Currently Available)

The following route file exists but is not mounted into the active router tree:

- `src/routes/Systems/flag.routes.ts`

So no `/api/...` System Flag endpoints are currently reachable unless that router is mounted.
