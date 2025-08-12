# A-SEARCH API Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Rate Limiting](#rate-limiting)

## 🎯 Overview

The A-SEARCH API provides comprehensive endpoints for managing health research data, user authentication, and geographic information. All endpoints return JSON responses and use standard HTTP status codes.

### API Versioning

- Current Version: `v1`
- Base URL: `/api/v1`

## 🔐 Authentication

### Authentication Methods

1. **Bearer Token** (Recommended)

   ```
   Authorization: Bearer <token>
   ```

2. **Session Cookie** (Browser-based)
   ```
   Cookie: sb-<project-ref>-auth-token=<session-token>
   ```

### Getting Authentication Token

```bash
# Login to get access token
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

## 🌐 Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://a-search.org/api`

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 422  | Validation Error      |
| 500  | Internal Server Error |

## 📡 Endpoints

### Authentication

#### POST /api/auth/login

Authenticate user with email and password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "admin"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/register

Register a new user account.

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "Jane Doe",
  "phone_number": "+1234567890"
}
```

#### POST /api/auth/logout

Logout current user.

**Headers:**

```
Authorization: Bearer <token>
```

#### POST /api/auth/refresh

Refresh access token.

**Request:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management

#### GET /api/users

Get all users (Admin only).

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search by name or email
- `role` (string): Filter by role
- `status` (string): Filter by status

**Response:**

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "admin",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### GET /api/users/:id

Get user by ID.

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "admin",
  "status": "active",
  "phone_number": "+1234567890",
  "site_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### POST /api/users

Create new user (Admin only).

**Request:**

```json
{
  "email": "newuser@example.com",
  "full_name": "Jane Doe",
  "password": "password123",
  "role_id": "uuid",
  "site_id": "uuid",
  "phone_number": "+1234567890"
}
```

#### PUT /api/users/:id

Update user.

**Request:**

```json
{
  "full_name": "Updated Name",
  "role_id": "uuid",
  "site_id": "uuid",
  "status": "active"
}
```

#### DELETE /api/users/:id

Delete user (Admin only).

### Site Management

#### GET /api/sites

Get all sites.

**Query Parameters:**

- `country_id` (string): Filter by country
- `search` (string): Search by name
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**

```json
{
  "sites": [
    {
      "id": "uuid",
      "name": "Korogacho",
      "description": "Nairobi slum area",
      "country_id": "uuid",
      "country": {
        "name": "Kenya",
        "code": "KE"
      },
      "location_name": "Nairobi",
      "latitude": -1.2921,
      "longitude": 36.8219,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### GET /api/sites/:id

Get site by ID.

#### POST /api/sites

Create new site.

**Request:**

```json
{
  "name": "New Site",
  "description": "Site description",
  "country_id": "uuid",
  "location_name": "City Name",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "address": "Full address"
}
```

#### PUT /api/sites/:id

Update site.

#### DELETE /api/sites/:id

Delete site.

### Geographic Data

#### GET /api/countries

Get all countries.

#### GET /api/villages

Get all villages.

**Query Parameters:**

- `site_id` (string): Filter by site
- `search` (string): Search by name

#### GET /api/structures

Get all structures.

**Query Parameters:**

- `village_id` (string): Filter by village
- `search` (string): Search by code or name

#### GET /api/dwelling-units

Get all dwelling units.

**Query Parameters:**

- `structure_id` (string): Filter by structure
- `search` (string): Search by code

### Account Requests

#### GET /api/account-requests

Get all account requests.

**Query Parameters:**

- `status` (string): Filter by status (pending, approved, rejected)
- `search` (string): Search by name or email

#### POST /api/account-requests

Create account request.

**Request:**

```json
{
  "email": "request@example.com",
  "full_name": "Request User",
  "phone_number": "+1234567890",
  "requested_role_id": "uuid",
  "requested_site_id": "uuid",
  "reason": "Research purposes"
}
```

#### PUT /api/account-requests/:id

Update account request status.

**Request:**

```json
{
  "status": "approved",
  "reviewed_by": "uuid"
}
```

### Analytics

#### GET /api/analytics/dashboard

Get dashboard analytics.

**Response:**

```json
{
  "user_count": 150,
  "site_count": 25,
  "village_count": 100,
  "structure_count": 500,
  "dwelling_unit_count": 2000,
  "recent_activity": [
    {
      "type": "user_created",
      "user": "John Doe",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /api/analytics/geographic

Get geographic analytics.

#### GET /api/analytics/health

Get health analytics.

## 📊 Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role_id: string;
  site_id?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}
```

### Site

```typescript
interface Site {
  id: string;
  name: string;
  description?: string;
  country_id: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}
```

### Country

```typescript
interface Country {
  id: string;
  name: string;
  code: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}
```

### Village

```typescript
interface Village {
  id: string;
  name: string;
  site_id: string;
  created_at: string;
  updated_at: string;
}
```

### Structure

```typescript
interface Structure {
  id: string;
  structure_code: string;
  structure_name?: string;
  village_id: string;
  address_description?: string;
  created_at: string;
  updated_at: string;
}
```

### DwellingUnit

```typescript
interface DwellingUnit {
  id: string;
  unit_code: string;
  unit_type: string;
  structure_id: string;
  occupancy_status: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
```

## 🚦 Rate Limiting

- **Authentication endpoints**: 10 requests per minute
- **User management**: 100 requests per minute
- **Site management**: 100 requests per minute
- **Analytics**: 50 requests per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔒 Security

### CORS

- Allowed origins: `https://a-search.org`, `http://localhost:3000`
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Content-Type, Authorization

### Data Validation

- All inputs are validated using Zod schemas
- SQL injection protection via parameterized queries
- XSS protection via input sanitization

### Row Level Security (RLS)

- Database-level security policies
- User can only access data they're authorized to view
- Automatic filtering based on user role and site assignment

## 📝 Examples

### Complete Authentication Flow

```bash
# 1. Login
curl -X POST https://a-search.org/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 2. Use token for authenticated requests
curl -X GET https://a-search.org/api/users \
  -H "Authorization: Bearer <access_token>"
```

### Creating a New Site

```bash
curl -X POST https://a-search.org/api/sites \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Research Site",
    "description": "A new research site for health studies",
    "country_id": "uuid",
    "location_name": "Nairobi",
    "latitude": -1.2921,
    "longitude": 36.8219
  }'
```

## 📞 Support

For API support:

- Create an issue in the GitHub repository
- Check the [FAQ](./FAQ.md)
- Contact the development team

---

**A-SEARCH API** - Empowering health research across Africa 🌍
